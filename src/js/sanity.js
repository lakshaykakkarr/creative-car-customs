/* ============================================
   sanity.js — Shared Sanity CDN client
   Project: w4fgl3xy | Dataset: production
   ============================================ */

import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'w4fgl3xy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,       // CDN allows all origins (CORS-safe). Cache clears ~1 min after publishing.
  perspective: 'published',
});

/** Renders star SVGs for a given rating (1-5) */
export function renderStars(rating = 5) {
  const starSvg = `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  return Array.from({ length: rating }, () => starSvg).join('');
}

/** Escapes HTML special characters to prevent XSS */
export function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
