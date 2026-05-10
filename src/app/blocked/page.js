export const metadata = {
  title: 'Service Not Available — Dinesh Wines',
  description: 'Dinesh Wines is not available in your region.',
  robots: { index: false, follow: false },
};

export default function BlockedPage() {
  return (
    <div className="blocked-page">
      <div style={{ maxWidth: '480px' }}>
        <span className="blocked-icon" aria-hidden="true">🚫</span>

        <h1
          className="display-md"
          style={{ fontFamily: 'var(--font-display)', marginBottom: '16px', color: 'var(--text-primary)' }}
        >
          Service Not Available
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            lineHeight: '1.7',
          }}
        >
          We&apos;re sorry — <strong style={{ color: 'var(--text-primary)' }}>Dinesh Wines</strong> is
          not available in your region as per Indian law.
        </p>

        <div
          style={{
            background: 'rgba(224, 84, 84, 0.08)',
            border: '1px solid rgba(224, 84, 84, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}
          role="note"
        >
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            <strong style={{ color: '#e05454', display: 'block', marginBottom: '8px' }}>
              Restricted States (Prohibition Zones):
            </strong>
            Gujarat &nbsp;|&nbsp; Bihar &nbsp;|&nbsp; Nagaland &nbsp;|&nbsp; Mizoram
          </p>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          This restriction is in compliance with Indian excise regulations.
          If you believe this is an error, please ensure your location settings
          are accurate or contact us.
        </p>
      </div>
    </div>
  );
}
