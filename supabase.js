/* ============================================================
   SJ ADV. — Supabase Configuration (shared)
   ------------------------------------------------------------
   ⚠️  SETUP — PASTE YOUR CREDENTIALS BELOW (2 lines only):

   1) Open your Supabase project dashboard:
      https://supabase.com/dashboard/project/_/settings/api

   2) Copy the "Project URL"  → paste it in SUPABASE_URL
   3) Copy the "anon public"  → paste it in SUPABASE_KEY
      (Project Settings → API → Project API Keys → anon / publishable)

   ❌ NEVER paste the service_role key here. It must stay secret.
      Only the anon/publishable (public) key is safe for the browser.

   This single file creates THE one and only Supabase client.
   Both index.html (visitor side) and admin.html (dashboard)
   reuse `window.supabaseClient` — do NOT create another client.
   ============================================================ */

(function () {
  'use strict';

  /* ⬇⬇⬇  PASTE YOUR SUPABASE CREDENTIALS HERE  ⬇⬇⬇ */
  const SUPABASE_URL = "https://yagpniqdztrksfsfvuqw.supabase.co";                 // e.g. "https://abcdefgh.supabase.co"
  const SUPABASE_KEY = "sb_publishable_6Jdw63HuU22rlGl0qDSMpw_ZGTZMTf1";     // e.g. "eyJhbGciOiJI..." (anon public key ONLY)
  /* ⬆⬆⬆  PASTE YOUR SUPABASE CREDENTIALS HERE  ⬆⬆⬆ */

  // Configured = SDK loaded + URL looks like https://… + key looks like a JWT/anon key.
  // (Format-based on purpose — survives naive find-&-replace of the placeholder names.)
  const supabaseConfigured =
    typeof window.supabase !== 'undefined' &&
    /^https?:\/\/.+\..+/i.test(SUPABASE_URL) &&
    !/YOUR_SUPABASE/i.test(SUPABASE_URL) &&
    SUPABASE_KEY.length >= 20 &&
    !/YOUR_SUPABASE/i.test(SUPABASE_KEY);

  if (typeof window.supabase === 'undefined') {
    console.error('[SJ ADV] Supabase SDK (supabase-js v2) failed to load. ' +
      'Check your internet connection / the CDN <script> tag.');
  } else if (!supabaseConfigured) {
    console.error('[SJ ADV] supabase.js still contains placeholders. ' +
      'Open supabase.js and paste YOUR_SUPABASE_URL and YOUR_SUPABASE_PUBLISHABLE_KEY.');
  }

  // Single shared client for the whole site (guard against duplicates).
  if (supabaseConfigured && !window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  }

  /* ============================================================
     Shared security helpers (used by script.js and admin.js)
     ------------------------------------------------------------
     ALL dynamic values coming from the database MUST pass through
     escapeHtml() / escapeAttribute() before being placed into
     innerHTML — this prevents XSS from user-entered content.
     ============================================================ */

  /** Escape a value for safe use inside HTML text content. */
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /** Escape a value for safe use inside double/single-quoted attributes. */
  function escapeAttribute(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/`/g, '&#096;');
  }

  /** Only allow http(s) URLs — blocks javascript: and other dangerous schemes. */
  function isSafeHttpUrl(value) {
    try {
      const url = new URL(String(value || '').trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  /** Human-friendly date (Arabic when the document is Arabic). */
  function formatDate(value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    try {
      const lang = (document.documentElement.getAttribute('lang') || 'ar') === 'ar' ? 'ar-EG' : 'en-GB';
      return new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    } catch (_) {
      return date.toISOString().slice(0, 10);
    }
  }

  window.SJSupabase = {
    client: null, // set below (or null when not configured)
    configured: supabaseConfigured,
    escapeHtml: escapeHtml,
    escapeAttribute: escapeAttribute,
    isSafeHttpUrl: isSafeHttpUrl,
    formatDate: formatDate
  };
  window.SJSupabase.client = supabaseConfigured ? window.supabaseClient : null;
})();