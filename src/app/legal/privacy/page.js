export const metadata = {
  title: 'Privacy Policy — Dinesh Wines',
  description: 'Privacy Policy for Dinesh Wines liquor catalog platform.',
};

export default function PrivacyPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="label" style={{ display: 'block', marginBottom: '16px' }}>Legal</span>
          <h1 className="display-lg">Privacy Policy</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="container section-sm">
        <div className="legal-content">
          <p>
            Dinesh Wines (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when 
            you visit our website.
          </p>

          <h2>1. Information We Collect</h2>
          <h3>1.1 Information You Provide</h3>
          <p>When you contact us via our contact form, we collect:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number (optional)</li>
            <li>Message content</li>
          </ul>

          <h3>1.2 Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Pages visited and time spent</li>
            <li>Referring web page</li>
            <li>General geographic location (country/state level, for compliance purposes)</li>
          </ul>

          <h3>1.3 Age Verification Data</h3>
          <p>
            We collect your date of birth during the age verification process. This information is 
            stored only in your browser&apos;s session storage and is NOT transmitted to our servers.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information collected to:</p>
          <ul>
            <li>Respond to your inquiries and messages</li>
            <li>Verify that users meet the minimum age requirement (21+)</li>
            <li>Ensure compliance with state-wise alcohol regulations</li>
            <li>Improve our website and user experience</li>
            <li>Communicate about products and store information</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do NOT sell, trade, or rent your personal information to third parties.
            We may share information with:
          </p>
          <ul>
            <li>Service providers who assist in operating our website (e.g., hosting, analytics)</li>
            <li>Legal authorities when required by law</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            Contact form submissions are retained for a period of 90 days for customer service purposes,
            after which they are deleted. Age verification data is stored only in session storage 
            and is cleared when you close your browser.
          </p>

          <h2>5. Cookies</h2>
          <p>
            We use session storage (not cookies) for age verification and location compliance checks.
            Our website may use minimal analytics cookies to understand user behaviour. You can 
            disable cookies in your browser settings.
          </p>

          <h2>6. Third-Party Services</h2>
          <p>
            Our website may use the following third-party services:
          </p>
          <ul>
            <li><strong>OpenStreetMap / Nominatim</strong> — for location-based compliance (no personal data stored)</li>
            <li><strong>WhatsApp</strong> — for store contact (subject to WhatsApp&apos;s own privacy policy)</li>
            <li><strong>Google Maps</strong> — for store location links</li>
            <li><strong>Unsplash</strong> — for product imagery</li>
          </ul>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2>8. Security</h2>
          <p>
            We implement appropriate technical and organisational security measures to protect your 
            personal information. However, no internet transmission is completely secure.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. The updated version will be indicated 
            by a revised &ldquo;Last updated&rdquo; date. Continued use of our website constitutes acceptance 
            of the updated policy.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            For privacy-related questions, please contact us via our{' '}
            <a href="/contact" style={{ color: 'var(--gold)' }}>Contact page</a>.
          </p>
        </div>
      </div>
    </>
  );
}
