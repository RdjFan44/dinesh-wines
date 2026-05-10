export const metadata = {
  title: 'Disclaimer — Dinesh Wines',
  description: 'Legal disclaimer for Dinesh Wines. This platform does not sell or deliver alcohol directly.',
};

export default function DisclaimerPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="label" style={{ display: 'block', marginBottom: '16px' }}>Legal</span>
          <h1 className="display-lg">Disclaimer</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="container section-sm">
        <div className="legal-content">

          {/* Highlight Box */}
          <div
            role="note"
            style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '28px',
              marginBottom: '48px',
            }}
          >
            <p className="label" style={{ marginBottom: '12px', display: 'block', fontSize: '12px' }}>
              ⚖️ Primary Disclaimer
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-primary)' }}>
              <strong>Dinesh Wines is a catalog and store-connection platform only.</strong>{' '}
              This platform does NOT sell, supply, or deliver alcohol directly.
              All products displayed are available exclusively at our licensed retail store(s).
            </p>
          </div>

          <h2>1. Platform Nature</h2>
          <p>
            The Dinesh Wines website (&ldquo;Platform&rdquo;) functions solely as a product discovery and 
            store connection layer. The Platform:
          </p>
          <ul>
            <li>Displays a catalog of alcoholic beverages available at licensed retail stores</li>
            <li>Provides contact information to connect users with licensed retailers</li>
            <li>Does NOT process any sale, payment, or delivery of alcohol</li>
            <li>Is NOT an e-commerce platform</li>
            <li>Does NOT have a cart, checkout, or payment system</li>
          </ul>

          <h2>2. No Direct Sale</h2>
          <p>
            Dinesh Wines does not sell alcohol. Any purchase of products requires direct 
            engagement with our licensed retail store. The Platform merely facilitates discovery
            of products and connection with the store.
          </p>

          <h2>3. Store Responsibility</h2>
          <p>
            All products listed on this platform are sold by our licensed retail store.
            Compliance with applicable local excise laws, regulations, and licensing requirements 
            is the responsibility of the respective retail store. Dinesh Wines accepts no 
            responsibility for any regulatory compliance at the point of sale.
          </p>

          <h2>4. Delivery Disclaimer</h2>
          <p>
            Delivery of alcoholic beverages, if offered by our store, is handled exclusively 
            by the licensed retailer and is subject to applicable local laws and regulations.
            <strong> Age verification is mandatory at the point of delivery.</strong> The Platform 
            is not responsible for delivery operations.
          </p>

          <h2>5. Product Information</h2>
          <p>
            All product information (descriptions, images, alcohol content, origin) displayed 
            on this Platform is for <strong>informational purposes only</strong>.
          </p>
          <ul>
            <li>Prices shown are indicative ranges — actual prices may differ</li>
            <li>Product availability is subject to change without notice</li>
            <li>Images are representative and may not exactly match the product</li>
            <li>Always contact the store to confirm current pricing and availability</li>
          </ul>

          <h2>6. Age Restriction</h2>
          <p>
            This Platform is intended for individuals who are <strong>21 years of age or older</strong>, 
            as required under Indian excise laws. The Platform employs age verification mechanisms,
            but it is ultimately the user&apos;s responsibility to comply with the legal drinking age 
            in their jurisdiction.
          </p>

          <h2>7. Geographic Restriction</h2>
          <p>
            This Platform is not available in states where alcohol is prohibited under law.
            Currently restricted states include:
          </p>
          <ul>
            <li>Gujarat</li>
            <li>Bihar</li>
            <li>Nagaland</li>
            <li>Mizoram</li>
          </ul>
          <p>
            Users from restricted states are prohibited from accessing this Platform.
            The Platform employs automated location-based access controls for this purpose.
          </p>

          <h2>8. Health Warning</h2>
          <p>
            Alcohol consumption carries health risks. Please drink responsibly.
            The Platform does not promote excessive alcohol consumption.
          </p>
          <ul>
            <li>Do not drink and drive</li>
            <li>Alcohol is harmful during pregnancy</li>
            <li>Excessive alcohol consumption is injurious to health</li>
          </ul>

          <h2>9. No Endorsement</h2>
          <p>
            The listing of products on this Platform does not constitute an endorsement of 
            any brand, manufacturer, or product by Dinesh Wines.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            Dinesh Wines shall not be responsible or liable for any loss, damage, injury, 
            or consequence arising from the use of this Platform or from the purchase of 
            any products from our retail store(s).
          </p>
        </div>
      </div>
    </>
  );
}
