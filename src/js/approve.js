/* ============================================
   approve.js — Admin feedback approval page:
   reads all review data from URL params,
   creates the Sanity doc on admin confirm.
   No Sanity fetch needed — all data is in the URL.
   ============================================ */

const SANITY_PROJECT_ID  = 'w4fgl3xy';
const SANITY_DATASET     = 'production';
const SANITY_API_VERSION = '2024-01-01';

const WRITE_TOKEN = import.meta.env.VITE_SANITY_WRITE_TOKEN;

// ---- DOM refs ----
const elLoading  = document.getElementById('approveLoading');
const elPanel    = document.getElementById('approvePanel');
const elSuccess  = document.getElementById('approveSuccess');
const elError    = document.getElementById('approveError');

function show(el) {
  [elLoading, elPanel, elSuccess, elError].forEach(e => { if (e) e.style.display = 'none'; });
  if (el) el.style.display = 'block';
}

// ---- Read URL params ----
const params  = new URLSearchParams(window.location.search);
const action  = params.get('action'); // 'approve' | 'discard'

// All review data is encoded in the URL by feedback-form.js
const reviewData = {
  name:     params.get('name')     || '',
  city:     params.get('city')     || '',
  service:  params.get('service')  || '',
  rating:   parseInt(params.get('rating') || '0', 10),
  comment:  params.get('comment')  || '',
  carMake:  params.get('carMake')  || '',
  carModel: params.get('carModel') || '',
  email:    params.get('email')    || '',
  phone:    params.get('phone')    || '',
};

if (!['approve', 'discard'].includes(action) || !reviewData.name || !reviewData.comment) {
  showError('Invalid or incomplete link. Please use the link from your notification email.');
} else if (!WRITE_TOKEN) {
  showError('Admin write token is not configured. Set VITE_SANITY_WRITE_TOKEN in .env and rebuild the site.');
} else {
  // All data is already available from URL params — render immediately, no fetch needed
  show(elLoading);
  setTimeout(() => { renderPanel(); show(elPanel); }, 300); // brief loading for UX
}

function renderPanel() {
  const isApprove = action === 'approve';
  const badge      = document.getElementById('approveActionBadge');
  const titleEl    = document.getElementById('approveTitle');
  const subtitleEl = document.getElementById('approveSubtitle');
  const starsEl    = document.getElementById('approveStars');
  const quoteEl    = document.getElementById('approveQuote');
  const meta1      = document.getElementById('approveMeta1');
  const meta2      = document.getElementById('approveMeta2');
  const meta3      = document.getElementById('approveMeta3');
  const confirmBtn = document.getElementById('approveConfirmBtn');

  if (badge) {
    badge.textContent       = isApprove ? 'Approve Review' : 'Discard Review';
    badge.style.color       = isApprove ? '#4ade80' : '#f87171';
    badge.style.borderColor = isApprove ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.35)';
    badge.style.background  = isApprove ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)';
  }

  if (titleEl)    titleEl.textContent    = isApprove ? 'Approve this review?' : 'Discard this review?';
  if (subtitleEl) subtitleEl.textContent = isApprove
    ? 'It will appear on the homepage immediately after confirmation.'
    : 'It will be marked as discarded and stay hidden from the website.';

  const r = reviewData.rating || 0;
  if (starsEl) starsEl.textContent = '\u2605'.repeat(r) + '\u2606'.repeat(5 - r);
  if (quoteEl) quoteEl.textContent = `"${reviewData.comment}"`;

  const car = [reviewData.carMake, reviewData.carModel].filter(Boolean).join(' ');
  if (meta1) meta1.textContent = reviewData.name ? `— ${reviewData.name}, ${reviewData.city}` : '';
  if (meta2) meta2.textContent = car ? `Car: ${car}` : '';
  if (meta3) meta3.textContent = reviewData.service ? `Service: ${reviewData.service}` : '';

  if (confirmBtn) {
    confirmBtn.textContent = isApprove ? 'Confirm — Approve Review' : 'Confirm — Discard Review';
    if (!isApprove) {
      confirmBtn.style.background  = 'rgba(248,113,113,0.15)';
      confirmBtn.style.color       = '#f87171';
      confirmBtn.style.borderColor = 'rgba(248,113,113,0.35)';
      confirmBtn.style.boxShadow   = 'none';
    }
    confirmBtn.addEventListener('click', confirmAction);
  }
}

async function confirmAction() {
  const confirmBtn = document.getElementById('approveConfirmBtn');
  if (confirmBtn) {
    confirmBtn.disabled     = true;
    confirmBtn.textContent  = 'Saving…';
  }

  const isApprove = action === 'approve';
  const status    = isApprove ? 'approved' : 'discarded';

  // Use a stable doc ID so clicking the link twice is idempotent
  const nameSlug = reviewData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
  const hash     = btoa(`${reviewData.name}:${reviewData.comment.slice(0, 30)}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  const docId    = `feedback-${nameSlug}-${hash}`;

  const initials = reviewData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${WRITE_TOKEN}`,
        },
        body: JSON.stringify({
          mutations: [{
            createOrReplace: {
              _id:             docId,
              _type:           'testimonial',
              status,
              reviewerName:    reviewData.name,
              initials,
              city:            reviewData.city,
              rating:          reviewData.rating,
              quote:           reviewData.comment,
              serviceReceived: reviewData.service,
              ...(reviewData.carMake  && { carMake:  reviewData.carMake }),
              ...(reviewData.carModel && { carModel: reviewData.carModel }),
              ...(reviewData.email    && { email:    reviewData.email }),
              ...(reviewData.phone    && { phone:    reviewData.phone }),
              submittedAt: new Date().toISOString(),
            },
          }],
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Sanity error (${res.status}): ${text}`);
    }

    const successTitle = document.getElementById('approveSuccessTitle');
    const successMsg   = document.getElementById('approveSuccessMsg');
    if (successTitle) successTitle.textContent = isApprove ? 'Review Approved!' : 'Review Discarded';
    if (successMsg) {
      successMsg.textContent = isApprove
        ? 'The review is now live on the homepage.'
        : 'The review has been discarded and will not appear on the website.';
    }
    show(elSuccess);

  } catch (err) {
    if (confirmBtn) {
      confirmBtn.disabled    = false;
      confirmBtn.textContent = isApprove ? 'Confirm — Approve Review' : 'Confirm — Discard Review';
    }
    showError(err.message || 'Action failed. Please try again or update the status in Sanity Studio.');
  }
}

function showError(msg) {
  const errMsg = document.getElementById('approveErrorMsg');
  if (errMsg) errMsg.textContent = msg;
  show(elError);
}
