// Cookie consent management for ExamPlat - e-Examination Platform.
// Preferences are stored in localStorage under a versioned key so we can
// prompt users again whenever the categories or policy change.

export const COOKIE_CONSENT_KEY = "examplat.cookie_consent.v1";
export const COOKIE_CONSENT_VERSION = 1;

// Dispatched on window whenever the stored consent changes.
// Use it to gate optional scripts (analytics / personalisation).
export const COOKIE_CONSENT_EVENT = "examplat:cookieConsentChanged";

// Dispatched on window to ask the consent banner to open the settings modal.
export const COOKIE_SETTINGS_EVENT = "examplat:openCookieSettings";

export const COOKIE_CATEGORIES = [
  {
    id: "necessary",
    label: "Strictly necessary",
    required: true,
    description:
      "Essential for the platform to function — sign-in sessions, security, load balancing, and payment processing. These cookies are always active and cannot be switched off.",
  },
  {
    id: "analytics",
    label: "Analytics & performance",
    required: false,
    description:
      "Help us understand how students use ExamPlat so we can improve features, content, and platform performance.",
  },
  {
    id: "preferences",
    label: "Preferences & marketing",
    required: false,
    description:
      "Remember your choices and help us personalise recommendations, notifications, and service communications.",
  },
];

export const DEFAULT_PREFERENCES = {
  version: COOKIE_CONSENT_VERSION,
  decision: null, // "all" | "necessary" | "custom"
  necessary: true,
  analytics: false,
  preferences: false,
  decidedAt: null,
  updatedAt: null,
};

export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// True when the visitor already made a decision for the current policy version.
export function hasCookieConsent() {
  const consent = getCookieConsent();
  return Boolean(consent && consent.version === COOKIE_CONSENT_VERSION);
}

// Effective preferences (sane defaults when nothing has been stored yet).
export function getCookiePreferences() {
  const consent = getCookieConsent();
  if (consent && consent.version === COOKIE_CONSENT_VERSION) {
    return { ...DEFAULT_PREFERENCES, ...consent };
  }
  return { ...DEFAULT_PREFERENCES };
}

// Convenience check for a specific category. "necessary" is always allowed.
export function isCategoryAllowed(categoryId) {
  if (categoryId === "necessary") return true;
  return Boolean(getCookiePreferences()[categoryId]);
}

/**
 * Persist a consent decision.
 * @param {object} options
 * @param {"all"|"necessary"|"custom"} options.decision
 * @param {boolean} [options.analytics]
 * @param {boolean} [options.preferences]
 */
export function saveCookieConsent({ decision, analytics = false, preferences = false }) {
  const now = new Date().toISOString();
  const existing = getCookieConsent();

  const merged = {
    version: COOKIE_CONSENT_VERSION,
    decision: decision || "necessary",
    necessary: true,
    analytics: Boolean(analytics),
    preferences: Boolean(preferences),
    decidedAt: (existing && existing.decidedAt) || now,
    updatedAt: now,
  };

  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(merged));

  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { ...merged } })
  );

  return merged;
}

/**
 * Re-open the cookie settings modal from anywhere in the app.
 */
export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}