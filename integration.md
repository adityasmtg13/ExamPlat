# Integration

1. Copy `Footer.jsx` into `src/components/`.
2. Copy `LegalPageLayout.jsx` into `src/components/`.
3. Copy `PrivacyPolicy.jsx` and `TermsAndConditions.jsx` into `src/pages/`.
4. In `Dashboard.jsx`, add `import Footer from "../components/Footer";` and render `<Footer />` immediately after `</main>`.
5. Add these routes wherever your React Router routes are declared:

```jsx
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/terms-and-conditions" element={<TermsAndConditions />} />
```

Replace the support and privacy email addresses with your real business contact details before release. Have the final policy reviewed for compliance with your jurisdiction and actual data practices.
