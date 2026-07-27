import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

function TermsAndConditions() {
  return (
    <LegalPageLayout
      eyebrow="Legal information"
      title="Terms & Conditions"
      intro="These terms set out the rules for using National Exam Platform and its educational services."
    >
      <LegalSection title="Acceptance of these terms">
        <p>By creating an account or using the platform, you agree to these Terms &amp; Conditions and our Privacy Policy. If you do not agree, please do not use the services.</p>
      </LegalSection>
      <LegalSection title="Your account">
        <p>You are responsible for providing accurate information and keeping your login credentials confidential. You must notify us promptly if you suspect unauthorized use of your account.</p>
      </LegalSection>
      <LegalSection title="Acceptable use">
        <p>You may use the platform for lawful educational purposes only. You must not attempt to access another user’s account, interfere with platform security, copy or distribute protected content, or use automated tools without permission.</p>
      </LegalSection>
      <LegalSection title="Educational content and results">
        <p>Mock tests, analytics, rank predictions, and college predictions are educational tools and estimates. They do not guarantee admission, examination outcomes, ranks, or eligibility decisions.</p>
      </LegalSection>
      <LegalSection title="Changes and contact">
        <p>We may update these terms as the platform evolves. Continued use after an update means you accept the revised terms. For questions, contact <a className="font-semibold text-cyan-700 hover:text-cyan-900" href="mailto:support@nationalexamplatform.in">support@nationalexamplatform.in</a>.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}

export default TermsAndConditions;
