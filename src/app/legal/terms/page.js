export const metadata = {
  title: 'Terms of Service — Dinesh Wines',
  description: 'Read the Terms of Service for Dinesh Wines, a liquor catalog platform in India.',
};

export default function TermsPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="label" style={{ display: 'block', marginBottom: '16px' }}>Legal</span>
          <h1 className="display-lg">Terms of Service</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="container section-sm">
        <div className="legal-content">
          <div
            role="note"
            style={{
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid var(--border-gold)',
              borderLeft: '3px solid var(--gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              marginBottom: '48px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
            }}
          >
            <strong style={{ color: 'var(--gold)' }}>Important: </strong>
            Dinesh Wines is a <strong>catalog and connection platform only</strong>. It does not sell, 
            supply, or deliver alcohol. By accessing this website, you agree to the following terms.
          </div>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website (&ldquo;Dinesh Wines&rdquo;), you acknowledge that you have read, 
            understood, and agree to be bound by these Terms of Service. If you do not agree to these 
            terms, please do not use this website.
          </p>

          <h2>2. Age Restriction</h2>
          <p>
            This website is intended exclusively for individuals who are of legal drinking age in their 
            jurisdiction, and in no case younger than <strong>21 years of age</strong> as per Indian law.
            By entering this website, you affirm that you meet this age requirement. We reserve the right 
            to terminate access for anyone who misrepresents their age.
          </p>

          <h2>3. Nature of Platform</h2>
          <p>
            Dinesh Wines is a <strong>product catalog and store-connection platform only</strong>. 
            This platform:
          </p>
          <ul>
            <li>Does NOT sell or supply alcohol</li>
            <li>Does NOT accept payments for alcohol</li>
            <li>Does NOT facilitate home delivery of alcohol</li>
            <li>Only displays products available at our licensed retail store</li>
            <li>Redirects users to contact our licensed retail store for purchase</li>
          </ul>
          <p>
            All sales and transactions are conducted exclusively at our licensed physical store(s) 
            in accordance with applicable excise and liquor laws of India.
          </p>

          <h2>4. Geographic Restrictions</h2>
          <p>
            This platform is not available in states where alcohol is prohibited under law, including 
            but not limited to: <strong>Gujarat, Bihar, Nagaland, and Mizoram</strong>. Users from 
            these states are prohibited from accessing this platform.
          </p>

          <h2>5. Accuracy of Information</h2>
          <p>
            Product information, pricing, and availability displayed on this platform are for 
            informational purposes only. Prices and availability may vary and are subject to change 
            without notice. Please contact our store directly for current pricing and availability.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All content on this website, including text, images, graphics, and logos, is the property 
            of Dinesh Wines or its licensors and is protected by applicable intellectual property laws.
          </p>

          <h2>7. Disclaimers</h2>
          <p>
            This website is provided &ldquo;as is&rdquo; without warranties of any kind. Dinesh Wines disclaims 
            all warranties, express or implied, including but not limited to merchantability, fitness 
            for a particular purpose, and non-infringement.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            Dinesh Wines shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising from your use or inability to use this platform.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to update these Terms of Service at any time. Continued use of 
            the platform after any changes constitutes acceptance of the new terms.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of India. 
            Any disputes shall be subject to the exclusive jurisdiction of courts in India.
          </p>

          <h2>11. Contact</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at our store 
            or via the <a href="/contact" style={{ color: 'var(--gold)' }}>Contact page</a>.
          </p>
        </div>
      </div>
    </>
  );
}
