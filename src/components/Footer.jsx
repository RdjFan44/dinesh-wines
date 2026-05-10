'use client';
import Link from 'next/link';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Browse Products' },
  { href: '/store', label: 'Our Store' },
  { href: '/contact', label: 'Contact Us' },
];

const legalLinks = [
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/disclaimer', label: 'Disclaimer' },
];

const categories = [
  { label: 'Whisky', href: '/shop?category=Whisky' },
  { label: 'Wine', href: '/shop?category=Wine' },
  { label: 'Beer', href: '/shop?category=Beer' },
  { label: 'Rum', href: '/shop?category=Rum' },
  { label: 'Gin', href: '/shop?category=Gin' },
  { label: 'Vodka', href: '/shop?category=Vodka' },
];

export default function Footer() {
  return (
    <footer style={{
      background: '#040d0e',
      borderTop: '1px solid var(--border)',
      padding: '80px 0 40px',
      color: 'var(--text-secondary)'
    }}>
      <div className="container">
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Brand */}
          <div style={{ gridColumn: '1 / -1', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Dinesh<span style={{ color: 'var(--accent)' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Your trusted destination for premium spirits and wines. 
              A catalog platform connecting you to licensed retail stores — not a seller.
            </p>
            <div className="badge badge-dark" style={{ marginTop: '20px' }}>
              21+ Only
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '20px' }}>Navigation</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} aria-label="Footer navigation">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '20px' }}>Categories</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} aria-label="Product categories">
              {categories.map((cat) => (
                <Link key={cat.href} href={cat.href} style={{ fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '20px' }}>Legal</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} aria-label="Legal pages">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '24px',
          marginBottom: '40px',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
          <p className="label" style={{ marginBottom: '12px' }}>⚖️ Important Disclaimer</p>
          <p>
            <strong>This platform does not sell or deliver alcohol directly.</strong>{' '}
            It only displays products available at licensed retail stores.
            All products are sold by licensed retailers — compliance with local laws
            is the responsibility of the respective store.
            Prices and availability may differ across stores.
            Delivery is handled by licensed retailers and subject to local laws —
            age verification is required at delivery.
          </p>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '12px'
        }}>
          <p>© {new Date().getFullYear()} Dinesh Wines. All rights reserved. | For informational purposes only.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>🇮🇳 India | 21+ Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
