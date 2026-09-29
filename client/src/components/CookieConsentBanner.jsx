import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCookieBite, FaShieldAlt, FaTimes } from "react-icons/fa";
import {
  COOKIE_CATEGORIES,
  COOKIE_CONSENT_EVENT,
  COOKIE_SETTINGS_EVENT,
  getCookieConsent,
  hasCookieConsent,
  saveCookieConsent,
} from "../services/cookieConsent";
import { getToken } from "../storage";

// localStorage key that records the auth token of the login session in which
// the user last handled the cookie banner. The Dashboard only re-prompts when
// this differs from the current token, i.e. once per fresh login.
const COOKIE_SESSION_KEY = "examplat.cookieSessionHandled";

function ToggleSwitch({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${checked ? "bg-cyan-600" : "bg-slate-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function CookieSettingsModal({ open, onClose, onDecision }) {
  const [analytics, setAnalytics] = useState(() => Boolean(getCookieConsent()?.analytics));
  const [preferences, setPreferences] = useState(
    () => Boolean(getCookieConsent()?.preferences)
  );

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const save = (decision) => {
    saveCookieConsent({
      decision,
      analytics: decision === "all" ? true : analytics,
      preferences: decision === "all" ? true : preferences,
    });
    onDecision();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-settings-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="animate-fade w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-950 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-lg text-cyan-300">
              <FaCookieBite />
            </span>
            <div>
              <h2 id="cookie-settings-title" className="text-lg font-bold text-white">
                Cookie Preferences
              </h2>
              <p className="text-xs text-slate-400">
                Manage how ExamPlat stores information on your device.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cookie settings"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <FaTimes />
          </button>
        </header>

        <div className="max-h-[55vh] space-y-4 overflow-y-auto px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">
            When you visit ExamPlat - e-Examination Platform, we may store cookies on
            your device to keep you signed in, keep the platform secure, and remember
            your choices. Choose which optional cookies you are happy to allow below.
          </p>

          <div className="space-y-3">
            {COOKIE_CATEGORIES.map((category) => {
              const isRequired = category.required;
              const checked =
                isRequired || (category.id === "analytics" ? analytics : preferences);
              const onChange =
                category.id === "analytics" ? setAnalytics : setPreferences;

              return (
                <div
                  key={category.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">{category.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {category.description}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isRequired ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          Always active
                        </span>
                      ) : (
                        <ToggleSwitch
                          checked={checked}
                          onChange={onChange}
                          label={category.label}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs leading-5 text-slate-500">
            For full details, read our{" "}
            <Link
              to="/cookie-policy"
              onClick={onClose}
              className="font-semibold text-cyan-700 hover:text-cyan-900"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        <footer className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => save("necessary")}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => save("custom")}
            className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
          >
            Save preferences
          </button>
        </footer>
      </div>
    </div>
  );
}
function CookieConsentBanner() {
  const location = useLocation();

  // Home: the banner is forced on every entry (even after a decision).
  // Dashboard: the banner shows once per login session, not on every entry.
  // Auth entry pages never show the banner (e.g. the login page after logout).
  const isHomePage = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password";

  const [showSettings, setShowSettings] = useState(false);
  const [settingsSession, setSettingsSession] = useState(0);
  // location.key uniquely identifies the current history entry, so the
  // banner re-appears on every fresh page load or re-entry to the Home page.
  const [dismissedKey, setDismissedKey] = useState(null);
  // Token of the login session in which the user last handled the banner, so
  // the Dashboard only prompts once per login (not on refesh or re-entry).
  const [handledSessionToken, setHandledSessionToken] = useState(() => {
    try {
      return localStorage.getItem(COOKIE_SESSION_KEY) || "";
    } catch {
      return "";
    }
  });
  const [, setConsentVersion] = useState(0);

  useEffect(() => {
    function handleConsentChanged() {
      setConsentVersion((version) => version + 1);
    }

    function handleOpenSettings() {
      setSettingsSession((session) => session + 1);
      setShowSettings(true);
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChanged);
    window.addEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChanged);
      window.removeEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
    };
  }, []);

  const currentToken = getToken() || "";

  const showBanner = isHomePage
    ? dismissedKey !== location.key
    : isDashboard
      ? handledSessionToken !== currentToken
      : isAuthPage
        ? false
        : !hasCookieConsent();

  const markHandled = () => {
    setDismissedKey(location.key);
    setHandledSessionToken(currentToken);
    try {
      localStorage.setItem(COOKIE_SESSION_KEY, currentToken);
    } catch {
      /* storage unavailable — ignore */
    }
  };

  const decide = (decision, optional = {}) => {
    saveCookieConsent({ decision, ...optional });
    markHandled();
    setShowSettings(false);
  };

  const acceptAll = () => {
    decide("all", { analytics: true, preferences: true });
  };

  const acceptNecessary = () => {
    decide("necessary", { analytics: false, preferences: false });
  };

  return (
    <>
      {showBanner ? (
        <div className="fixed inset-x-0 bottom-0 z-[150] p-4 sm:p-5">
          <div className="animate-fade mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
            <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-2xl text-cyan-700 md:flex">
                <FaCookieBite />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-sm text-cyan-700" />
                  <h2 className="text-base font-bold text-slate-950">
                    We value your privacy
                  </h2>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  We use cookies to keep you signed in, secure, and to improve your
                  learning experience. You can{" "}
                  <Link
                    to="/cookie-policy"
                    className="font-semibold text-cyan-700 hover:text-cyan-900"
                  >
                    learn more
                  </Link>{" "}
                  or manage your preferences at any time.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={acceptNecessary}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Only necessary
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
                >
                  Customize
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <CookieSettingsModal
        key={settingsSession}
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onDecision={() => {
          markHandled();
          setShowSettings(false);
        }}
      />
    </>
  );
}

export default CookieConsentBanner;