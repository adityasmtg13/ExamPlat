import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

function PrivacyPolicy() {
  return (
    <LegalPageLayout
      eyebrow="Legal information"
      title="Privacy Policy"
      intro="This policy explains how ExamPlat - e-Examination Platform collects, uses, and safeguards information when you use our services."
    >
      <LegalSection title="Information we collect">
        <p>We collect details you provide to create and manage your account, such as your name, email address, phone number, school, class, and exam preferences. We may also collect platform activity such as test attempts and performance data.</p>
      </LegalSection>
      <LegalSection title="How we use your information">
        <p>Your information helps us provide student services, personalize preparation tools, process registrations, improve the platform, respond to support requests, and send important service-related communications.</p>
      </LegalSection>
      <LegalSection title="How we protect information">
        <p>We use reasonable administrative, technical, and organizational safeguards to protect your information. Access is limited to authorized personnel and service providers who need it to operate the platform.</p>
      </LegalSection>
      <LegalSection title="Sharing and retention">
        <p>We do not sell personal information. We may share information with trusted providers that help us deliver services, or where required by law. We retain information only for as long as necessary for the purposes described in this policy and applicable legal requirements.</p>
      </LegalSection>
      <LegalSection title="Your choices and contact">
        <p>You may request access to or correction of your account information by contacting us. For privacy questions, email <a className="font-semibold text-cyan-700 hover:text-cyan-900" href="mailto:privacy@ExamPlat - e-Examination Platformexamplatform.in">privacy@ExamPlat - e-Examination Platformexamplatform.in</a>.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}

export default PrivacyPolicy;
