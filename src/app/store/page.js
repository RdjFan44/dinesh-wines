import Link from 'next/link';

export const metadata = {
  title: 'Our Store — Dinesh Wines',
  description: 'Visit Dinesh Wines store. Find our address, hours, contact details, and location map. All products are sold by our licensed retail store.',
};

async function getStore() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/stores`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.success && data.data.length > 0 ? data.data[0] : null;
  } catch {
    return null;
  }
}

export default async function StorePage() {
  const store = await getStore();

  const whatsappMsg = encodeURIComponent('Hi! I found you on Dinesh Wines catalog. I would like to inquire about your products.');

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="label" style={{ display: 'block', marginBottom: '16px' }}>Find Us</span>
          <h1 className="display-lg">Our Store</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '480px', margin: '12px auto 0' }}>
            Visit our licensed retail store in person, or contact us to check product availability and pricing.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Compliance Notice */}
        <div
          role="note"
          style={{
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 24px',
            marginBottom: '48px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: '1.2rem' }} aria-hidden="true">⚖️</span>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--gold)' }}>Store Responsibility Notice: </strong>
            All products are sold by our licensed retail store. Compliance with local laws is the responsibility of the store.
            Delivery is handled by the store and subject to local regulations — age verification is required at delivery.
          </p>
        </div>

        {store ? (
          <div className="store-info-grid">
            {/* Map */}
            <div>
              <div className="store-map">
                {store.googleMapsEmbed ? (
                  <iframe
                    src={store.googleMapsEmbed}
                    title={`${store.name} location map`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ border: 0 }}
                    allowFullScreen
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'var(--bg-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '32px',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }} aria-hidden="true">📍</span>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      Map embed URL not configured.<br />
                      Please add <code style={{ color: 'var(--gold)', fontSize: '12px' }}>googleMapsEmbed</code> to your store data.
                    </p>
                    {store.googleMapsUrl && (
                      <a
                        href={store.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        id="open-maps-btn"
                      >
                        Open in Google Maps
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Store Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '8px' }}>
                  {store.name}
                </h2>
                {store.license_info && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    License: {store.license_info}
                  </p>
                )}
              </div>

              <div className="info-card">
                <div className="info-card-item">
                  <span className="info-card-icon" aria-hidden="true">📍</span>
                  <div className="info-card-content">
                    <h4>Address</h4>
                    <p>
                      {store.address.street}<br />
                      {store.address.city}, {store.address.state} — {store.address.pincode}
                    </p>
                  </div>
                </div>

                <div className="info-card-item">
                  <span className="info-card-icon" aria-hidden="true">📞</span>
                  <div className="info-card-content">
                    <h4>Phone</h4>
                    <p>
                      <a href={`tel:${store.phone}`} style={{ color: 'var(--gold)' }}>
                        {store.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="info-card-item">
                  <span className="info-card-icon" aria-hidden="true">💬</span>
                  <div className="info-card-content">
                    <h4>WhatsApp</h4>
                    <p>
                      <a
                        href={`https://wa.me/${store.whatsapp}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#25d366' }}
                        id="store-whatsapp-link"
                      >
                        Chat with us ↗
                      </a>
                    </p>
                  </div>
                </div>

                <div className="info-card-item">
                  <span className="info-card-icon" aria-hidden="true">🕐</span>
                  <div className="info-card-content">
                    <h4>Store Hours</h4>
                    <p>
                      Mon–Fri: {store.hours?.weekdays}<br />
                      Sat–Sun: {store.hours?.weekends}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a
                  id="store-call-btn"
                  href={`tel:${store.phone}`}
                  className="btn btn-gold"
                >
                  📞 &nbsp; Call Store Now
                </a>
                <a
                  id="store-whatsapp-btn"
                  href={`https://wa.me/${store.whatsapp}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-action-btn whatsapp"
                  style={{ justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
                {store.googleMapsUrl && (
                  <a
                    id="store-directions-btn"
                    href={store.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-action-btn maps"
                    style={{ justifyContent: 'center' }}
                  >
                    📍 &nbsp; Get Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">🏪</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '16px' }}>
              Store info coming soon
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Please <Link href="/contact" style={{ color: 'var(--gold)' }}>contact us</Link> for store details.
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              (Seed the database at <code style={{ color: 'var(--gold)' }}>/api/seed</code> to populate store info)
            </p>
          </div>
        )}

        {/* Compliance Footer Note */}
        <div className="divider" style={{ marginTop: '80px' }} />
        <div className="legal-content" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            All products sold by Dinesh Wines are subject to applicable excise and liquor laws.
            The platform (dineshwines.in) acts as a catalog and connection layer only.
            We do not sell, deliver, or take payment for any alcohol products.
          </p>
        </div>
      </div>
    </>
  );
}
