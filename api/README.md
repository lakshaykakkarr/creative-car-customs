# Contact API (Hostinger SMTP)

This folder contains the PHP contact endpoint used by the website form.

## Files

- `send-contact.php`: JSON API endpoint that validates input and sends email via SMTP.
- `config.php.example`: Example server-side SMTP config. Copy to `config.php` and fill values.
- `composer.json`: Requires `phpmailer/phpmailer`.

## Setup

1. Install dependencies in this folder:

```bash
cd api
composer install --no-dev --optimize-autoloader
```

2. Copy config template and set your mailbox credentials:

```bash
cp config.php.example config.php
```

Required keys:
- `SMTP_HOST=smtp.hostinger.com`
- `SMTP_PORT=465` (SSL) or `587` (STARTTLS)
- `SMTP_USERNAME` (full mailbox email, e.g. `support@creativecarcustoms.com`)
- `SMTP_PASSWORD` (mailbox password)
- `MAIL_FROM` and `MAIL_TO`

3. Deploy `api/` to your Hostinger web root so endpoint is reachable as:

- `/api/send-contact.php`

## Localhost Testing

Run two servers in parallel:

1. Start PHP from the project root (so `/api/send-contact.php` is served):

```bash
php -S 127.0.0.1:8000
```

2. In another terminal, start Vite:

```bash
npm run dev
```

`vite.config.js` proxies `/api/*` to `http://127.0.0.1:8000`, so the frontend can keep using `/api/send-contact.php` locally.

## Security Notes

- Keep `config.php` server-side only. Never expose SMTP password in frontend files.
- `.gitignore` excludes `api/config.php` and `api/vendor/`.
- Endpoint includes:
  - Honeypot check
  - Basic per-IP rate limiting
  - Server-side validation
  - Optional origin allowlist (`ALLOWED_ORIGINS`)

## Frontend integration

`src/js/form.js` submits contact data to:

- `VITE_CONTACT_API_URL` if set, otherwise `/api/send-contact.php`

No SMTP credentials are used in frontend code.
