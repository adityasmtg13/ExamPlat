import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

const cookieCategories = [
  {
    name: "Strictly necessary cookies",
    purpose:
      "Required for the platform to function, including keeping you signed in, protecting against security risks, and completing exam registrations and payments.",
    example: "Session identifiers, authentication and security tokens, load-balancing cookies.",
    alwaysOn: true,
  },
  {
    name: "Analytics & performance cookies",
    purpose:
      "Help us understand how students use ExamPlat - e-Examination Platform so we can improve features, content, and platform performance.",
    example: "Aggregated usage statistics, page interaction data, performance monitoring.",
    alwaysOn: false,
  },
  {
    name: "Preferences & marketing cookies",
    purpose:
      "Remember the choices you make and help us personalise recommendations, notifications, and service communications.",
    example: "Saved preferences, personalisation flags, survey or campaign response data.",
    alwaysOn: false,
  },
];

function CookiePolicy() {
  return (
    <LegalPageLayout
      eyebrow="Legal information"
      title="Cookie Policy"
      intro="This policy explains how ExamPlat - e-Examination Platform uses cookies and similar technologies, and the choices you have to manage them."
    >
      <LegalSection title="What are cookies?">
        <p>
          Cookies are small text files stored on your device by your web browser when you
          visit a website. They help a website remember information about your visit, such
          as your sign-in status and preferences, which makes the experience smoother and
          more useful.
        </p>
      </LegalSection>

      <LegalSection title="How we use cookies">
        <p>
          We use cookies and similar technologies to keep the platform secure, keep you
          signed in, process exam registrations and payments, remember your choices, and
          understand how students use our services so we can improve them. Cookies alone do
          not identify you personally, but they may be linked to your account when you are
          signed in.
        </p>
      </LegalSection>

      <LegalSection title="The categories of cookies we use">
        <p>
          We ask for your consent before enabling optional cookies. You can review and change
          your choices at any time from the cookie banner or the Cookie Preferences panel in
          the footer of this site.
        </p>
        <div className="space-y-3">
          {cookieCategories.map((category) => (
            <div
              key={category.name}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900">{category.name}</h3>
                {category.alwaysOn ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    Always active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    Optional — requires consent
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{category.purpose}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                <span className="font-semibold">Examples:</span> {category.example}
              </p>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="Managing your cookie preferences">
        <p>
          When you first visit the platform, we show you a cookie banner where you can accept
          all cookies, accept only strictly necessary cookies, or open the Cookie Preferences
          panel to choose category by category. Your choice is stored on your device and can
          be changed at any time by opening the Cookie Preferences link in the footer. If you
          choose to accept only necessary cookies, the platform will continue to work, but
          optional features such as personalised analytics may not be available.
        </p>
      </LegalSection>

      <LegalSection title="Controlling cookies in your browser">
        <p>
          In addition to our preference panel, most web browsers let you view, block, or
          delete individual cookies through their settings. Because the exact steps differ
          between browsers, please refer to the help section of your browser for guidance.
          Please note that blocking or deleting certain strictly necessary cookies may affect
          your ability to sign in or use parts of the platform.
        </p>
      </LegalSection>

      <LegalSection title="Updates to this Cookie Policy">
        <p>
          We may update this Cookie Policy from time to time to reflect changes in our
          services or legal requirements. If we make material changes, we will update the
          date below and, where appropriate, ask for your consent again. Continued use of the
          platform after an update means you accept the revised Cookie Policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>
          If you have any questions about this Cookie Policy or your cookie preferences,
          contact us at{" "}
          <a
            className="font-semibold text-cyan-700 hover:text-cyan-900"
            href="mailto:privacy@examplat.in"
          >
            privacy@examplat.in
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

export default CookiePolicy;