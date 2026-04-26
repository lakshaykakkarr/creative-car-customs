<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function cfg(string $key, ?array $localConfig = null, string $default = ''): string
{
    $fromEnv = getenv($key);
    if ($fromEnv !== false && trim($fromEnv) !== '') {
        return trim($fromEnv);
    }

    if (is_array($localConfig) && isset($localConfig[$key]) && trim((string) $localConfig[$key]) !== '') {
        return trim((string) $localConfig[$key]);
    }

    return $default;
}

function sanitize_line(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

function esc_html(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function normalize_form_type(string $value): string
{
    $type = strtolower(trim($value));
    return in_array($type, ['feedback', 'quote'], true) ? $type : 'quote';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

$localConfig = null;
$configPath = __DIR__ . '/config.php';
if (is_file($configPath)) {
    $loaded = require $configPath;
    if (is_array($loaded)) {
        $localConfig = $loaded;
    }
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOriginsRaw = cfg('ALLOWED_ORIGINS', $localConfig, '');
$allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $allowedOriginsRaw))));

if (!empty($allowedOrigins) && $origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    respond(403, ['ok' => false, 'error' => 'Origin not allowed.']);
}

if ($origin !== '') {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 12000) {
    respond(413, ['ok' => false, 'error' => 'Payload too large.']);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'Invalid JSON payload.']);
}

// Honeypot field: should always be empty for real users.
if (!empty(trim((string) ($data['website'] ?? '')))) {
    respond(200, ['ok' => true, 'message' => 'Thanks.']);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$windowSeconds = max(60, (int) cfg('RATE_LIMIT_WINDOW_SECONDS', $localConfig, '600'));
$maxRequests = max(1, (int) cfg('RATE_LIMIT_MAX_REQUESTS', $localConfig, '6'));
$rateFile = sys_get_temp_dir() . '/ccc_form_rate_' . sha1($ip) . '.json';
$now = time();
$entries = [];

if (is_file($rateFile)) {
    $decoded = json_decode((string) file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $entries = array_values(array_filter($decoded, static fn ($t) => is_int($t) && ($now - $t) < $windowSeconds));
    }
}

if (count($entries) >= $maxRequests) {
    respond(429, ['ok' => false, 'error' => 'Too many requests. Please try again later.']);
}

$entries[] = $now;
@file_put_contents($rateFile, json_encode($entries), LOCK_EX);

$name = trim((string) ($data['name'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$city = trim((string) ($data['city'] ?? ''));
$service = trim((string) ($data['service'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$car = trim((string) ($data['car'] ?? ''));
$date = trim((string) ($data['date'] ?? ''));
$budget = trim((string) ($data['budget'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$formType = normalize_form_type((string) ($data['formType'] ?? 'quote'));

$rating = (int) ($data['rating'] ?? 0);
$comment = trim((string) ($data['comment'] ?? ''));
$carMake = trim((string) ($data['carMake'] ?? ''));
$carModel = trim((string) ($data['carModel'] ?? ''));
$approveUrl = trim((string) ($data['approveUrl'] ?? ''));
$discardUrl = trim((string) ($data['discardUrl'] ?? ''));

$errors = [];
if ($name === '') {
    $errors['name'] = 'Name is required.';
}
if ($city === '') {
    $errors['city'] = 'City is required.';
}
if ($service === '') {
    $errors['service'] = 'Service is required.';
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Email format is invalid.';
}

if ($formType === 'quote') {
    if ($phone === '' || !preg_match('/^[\+]?[0-9\s\-]{8,15}$/', $phone)) {
        $errors['phone'] = 'A valid phone number is required.';
    }
} else {
    if ($rating < 1 || $rating > 5) {
        $errors['rating'] = 'Rating must be between 1 and 5.';
    }
    if ($comment === '' || mb_strlen($comment) < 20) {
        $errors['comment'] = 'Comment must be at least 20 characters.';
    }
    if ($phone !== '' && !preg_match('/^[\+]?[0-9\s\-]{8,15}$/', $phone)) {
        $errors['phone'] = 'Phone format is invalid.';
    }
}

if (!empty($errors)) {
    respond(422, ['ok' => false, 'error' => 'Validation failed.', 'fields' => $errors]);
}

$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!is_file($autoloadPath)) {
    respond(500, ['ok' => false, 'error' => 'Server mail dependencies missing. Run composer install in api/.']);
}
require $autoloadPath;

$smtpHost = cfg('SMTP_HOST', $localConfig, 'smtp.hostinger.com');
$smtpPort = (int) cfg('SMTP_PORT', $localConfig, '465');
$smtpUsername = cfg('SMTP_USERNAME', $localConfig, '');
$smtpPassword = cfg('SMTP_PASSWORD', $localConfig, '');
$mailFrom = cfg('MAIL_FROM', $localConfig, $smtpUsername);
$mailTo = cfg('MAIL_TO', $localConfig, $smtpUsername);

if ($smtpUsername === '' || $smtpPassword === '' || $mailTo === '') {
    respond(500, ['ok' => false, 'error' => 'SMTP server configuration is incomplete.']);
}

$submittedAt = gmdate('Y-m-d H:i:s') . ' UTC';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

if ($formType === 'feedback') {
    $starStr = str_repeat('★', $rating) . str_repeat('☆', 5 - $rating);
    $subject = '[CCC Feedback] New ' . $rating . '-star review from ' . sanitize_line($name);
    $bodyLines = [
        'New customer feedback from Creative Car Customs website',
        '',
        'Name: ' . sanitize_line($name),
        'City: ' . sanitize_line($city),
        'Service Received: ' . sanitize_line($service),
        'Rating: ' . $rating . '/5 ' . $starStr,
        'Car: ' . ($car !== '' ? sanitize_line($car) : 'Not provided'),
        'Car Make: ' . ($carMake !== '' ? sanitize_line($carMake) : 'Not provided'),
        'Car Model: ' . ($carModel !== '' ? sanitize_line($carModel) : 'Not provided'),
        'Email: ' . ($email !== '' ? sanitize_line($email) : 'Not provided'),
        'Phone: ' . ($phone !== '' ? sanitize_line($phone) : 'Not provided'),
        '',
        'Review:',
        $comment,
        '',
        'Approve URL: ' . ($approveUrl !== '' ? $approveUrl : 'Not provided'),
        'Discard URL: ' . ($discardUrl !== '' ? $discardUrl : 'Not provided'),
        '',
        '--- Metadata ---',
        'Submitted At: ' . $submittedAt,
        'Source IP: ' . $ip,
        'User Agent: ' . sanitize_line($userAgent),
    ];

    $reviewHtml = nl2br(esc_html($comment));
    $approveHtmlUrl = $approveUrl !== '' ? esc_html($approveUrl) : '';
    $discardHtmlUrl = $discardUrl !== '' ? esc_html($discardUrl) : '';

    $htmlBody =
        '<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#111">'
      . '<h2 style="margin:0 0 12px">New customer feedback from Creative Car Customs website</h2>'
      . '<p style="margin:0 0 8px"><strong>Name:</strong> ' . esc_html(sanitize_line($name)) . '<br>'
      . '<strong>City:</strong> ' . esc_html(sanitize_line($city)) . '<br>'
      . '<strong>Service Received:</strong> ' . esc_html(sanitize_line($service)) . '<br>'
      . '<strong>Rating:</strong> ' . esc_html((string) $rating) . '/5 ' . esc_html($starStr) . '<br>'
      . '<strong>Car:</strong> ' . esc_html($car !== '' ? sanitize_line($car) : 'Not provided') . '<br>'
      . '<strong>Car Make:</strong> ' . esc_html($carMake !== '' ? sanitize_line($carMake) : 'Not provided') . '<br>'
      . '<strong>Car Model:</strong> ' . esc_html($carModel !== '' ? sanitize_line($carModel) : 'Not provided') . '<br>'
      . '<strong>Email:</strong> ' . esc_html($email !== '' ? sanitize_line($email) : 'Not provided') . '<br>'
      . '<strong>Phone:</strong> ' . esc_html($phone !== '' ? sanitize_line($phone) : 'Not provided') . '</p>'
      . '<p style="margin:0 0 8px"><strong>Review:</strong><br>' . $reviewHtml . '</p>'
      . '<div style="margin:16px 0 12px">'
      . ($approveHtmlUrl !== ''
          ? '<a href="' . $approveHtmlUrl . '" style="display:inline-block;padding:10px 16px;margin-right:10px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;font-weight:700">Approve</a>'
          : '')
      . ($discardHtmlUrl !== ''
          ? '<a href="' . $discardHtmlUrl . '" style="display:inline-block;padding:10px 16px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;font-weight:700">Deny</a>'
          : '')
      . '</div>'
      . '<p style="margin:12px 0 0;color:#555;font-size:12px">'
      . '<strong>Submitted At:</strong> ' . esc_html($submittedAt) . '<br>'
      . '<strong>Source IP:</strong> ' . esc_html($ip) . '<br>'
      . '<strong>User Agent:</strong> ' . esc_html(sanitize_line($userAgent))
      . '</p>'
      . '</div>';
} else {
    $subject = '[CCC Contact] ' . sanitize_line($service) . ' inquiry from ' . sanitize_line($name);
    $bodyLines = [
        'New contact inquiry from Creative Car Customs website',
        '',
        'Name: ' . sanitize_line($name),
        'Phone: ' . sanitize_line($phone),
        'Email: ' . ($email !== '' ? sanitize_line($email) : 'Not provided'),
        'City: ' . sanitize_line($city),
        'Service: ' . sanitize_line($service),
        'Car: ' . ($car !== '' ? sanitize_line($car) : 'Not provided'),
        'Preferred Date: ' . ($date !== '' ? sanitize_line($date) : 'Not provided'),
        'Budget: ' . ($budget !== '' ? sanitize_line($budget) : 'Not provided'),
        '',
        'Message:',
        $message !== '' ? $message : 'Not provided',
        '',
        '--- Metadata ---',
        'Submitted At: ' . $submittedAt,
        'Source IP: ' . $ip,
        'User Agent: ' . sanitize_line($userAgent),
    ];

    $htmlBody = null;
}

$plainBody = implode("\n", $bodyLines);

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->Port = $smtpPort;

    if ($smtpPort === 465) {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    }

    $mail->CharSet = 'UTF-8';
    $mail->setFrom($mailFrom, 'Creative Car Customs Website');
    $mail->addAddress($mailTo);

    if ($email !== '') {
        $mail->addReplyTo($email, sanitize_line($name));
    }

    $mail->Subject = $subject;

    if (!empty($htmlBody)) {
        $mail->isHTML(true);
        $mail->Body = $htmlBody;
        $mail->AltBody = $plainBody;
    } else {
        $mail->isHTML(false);
        $mail->Body = $plainBody;
    }

    $mail->send();
    $successMessage = $formType === 'feedback'
        ? 'Feedback sent successfully.'
        : 'Inquiry sent successfully.';

    respond(200, ['ok' => true, 'message' => $successMessage]);
} catch (Exception $e) {
    error_log('[ccc-contact-mail] ' . $e->getMessage());
    respond(500, ['ok' => false, 'error' => 'Could not send email right now. Please try again shortly.']);
}
