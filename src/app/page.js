import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import PartnersMarquee from '@/components/PartnersMarquee';
import CategoryScroll from '@/components/CategoryScroll';

export const metadata = {
  title: 'Dinesh Wines — Premium Spirits Catalog | India',
  description: 'Browse India\'s finest liquor catalog — whisky, wine, beer, rum, gin & more. Dinesh Wines, Maharashtra.',
};

async function getFeaturedProducts() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}/api/products?featured=true&limit=8`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          HERO  — full-screen, image right, text left (Hedonne style)
      ══════════════════════════════════════════════════════════ */}
      <section className="hp-hero" aria-label="Hero">
        {/* gradient: strong on left → fades right → blends into dark on mobile from bottom */}
        <div className="hp-hero__grad-lr"  />
        <div className="hp-hero__grad-btm" />

        <div className="container hp-hero__content">
          {/* Eyebrow */}
          <p className="hp-eyebrow">
            <span className="hp-eyebrow__line" />
            Your Destination For
          </p>

          {/* Title */}
          <h1 className="hp-title">
            FINE<br /><em>SPIRITS</em>
          </h1>

          {/* Subtitle */}
          <p className="hp-sub">
            From classic favourites to new discoveries — browse our curated catalog of premium spirits. Maharashtra's finest liquor destination.
          </p>

          {/* CTA */}
          <div className="hp-cta-row">
            <Link href="/shop" className="btn btn-accent hp-cta-btn">
              Browse Collection
            </Link>
            <a
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost hp-cta-btn hp-wa-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Scroll hint */}
          <div className="hp-scroll-hint" aria-hidden="true">
            <span className="hp-scroll-hint__line" />
            <span className="hp-scroll-hint__text">Scroll</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SHOP BY CATEGORY  (horizontal scroll strip like Hedonne)
      ══════════════════════════════════════════════════════════ */}
      <section className="hp-section" aria-label="Shop by category">
        <div className="container">
          <div className="hp-section__head">
            <span className="hp-section__kicker">Our Range</span>
            <h2 className="hp-section__title">Shop by Category</h2>
          </div>
        </div>
        <CategoryScroll />
      </section>

      {/* ══════════════════════════════════════════════════════════
          HIGHLIGHTED PRODUCTS
      ══════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="hp-section" aria-label="Highlighted products">
          <div className="container">
            <div className="hp-section__head">
              <span className="hp-section__kicker">Curated For You</span>
              <h2 className="hp-section__title">Highlighted Products</h2>
            </div>
            <div className="grid-products">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            <div className="hp-view-all">
              <Link href="/shop" className="btn btn-outline">View Full Catalog →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          WHY DINESH WINES  (trust strip like Hedonne)
      ══════════════════════════════════════════════════════════ */}
      <section className="hp-trust" aria-label="Why choose us">
        <div className="container hp-trust__grid">
          {[
            { icon: '🏆', title: 'Premium Selection',  desc: 'Curated range of India\'s finest spirits' },
            { icon: '💬', title: 'WhatsApp Inquiry',   desc: 'Quick & easy enquiry per product' },
            { icon: '📋', title: 'Catalog Only',        desc: 'Browse freely, contact store to purchase' },
            { icon: '🇮🇳', title: 'Maharashtra Based',  desc: 'Trusted local liquor destination' },
          ].map(item => (
            <div key={item.title} className="hp-trust__card">
              <span className="hp-trust__icon">{item.icon}</span>
              <h3 className="hp-trust__name">{item.title}</h3>
              <p  className="hp-trust__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          OUR PARTNERS  (auto-scrolling marquee)
      ══════════════════════════════════════════════════════════ */}
      <section className="hp-section" aria-label="Our partners">
        <div className="container">
          <div className="hp-section__head">
            <span className="hp-section__kicker">Brands We Stock</span>
            <h2 className="hp-section__title">Our Partners</h2>
          </div>
        </div>
        <PartnersMarquee />
      </section>

      {/* ══════════════════════════════════════════════════════════
          STYLES
      ══════════════════════════════════════════════════════════ */}
      <style>{`
        /* ── HERO ───────────────────────────────────────────────── */
        .hp-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background-image: url('/Front Main Image.png');
          background-size: cover;
          background-position: 65% center;
          background-repeat: no-repeat;
        }

        /* left→right gradient keeps text readable, right side shows image */
        .hp-hero__grad-lr {
          position: absolute; inset: 0;
          background: linear-gradient(
            to right,
            rgba(7,26,29,0.97) 0%,
            rgba(7,26,29,0.80) 40%,
            rgba(7,26,29,0.25) 68%,
            transparent 100%
          );
        }
        /* bottom fade to blend into next section */
        .hp-hero__grad-btm {
          position: absolute; bottom: 0; left: 0; right: 0; height: 240px;
          background: linear-gradient(to top, var(--bg-primary), transparent);
        }

        .hp-hero__content {
          position: relative; z-index: 2;
          padding-top: 160px;
          padding-bottom: 120px;
          max-width: 560px;
        }

        /* Eyebrow */
        .hp-eyebrow {
          display: flex; align-items: center; gap: 14px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 24px;
          opacity: 0; animation: fadeSlideUp .7s ease forwards .15s;
        }
        .hp-eyebrow__line { width: 32px; height: 1px; background: var(--accent); flex-shrink: 0; }

        /* Title */
        .hp-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6.5vw, 5rem);
          font-weight: 400;
          line-height: 1.05;
          color: var(--text-primary);
          margin-bottom: 22px;
          letter-spacing: -0.01em;
          opacity: 0; animation: fadeSlideUp .7s ease forwards .3s;
        }
        .hp-title em { font-style: italic; color: var(--accent); }

        /* Sub */
        .hp-sub {
          font-size: 15px; line-height: 1.75;
          color: var(--text-secondary);
          max-width: 400px;
          margin-bottom: 36px;
          opacity: 0; animation: fadeSlideUp .7s ease forwards .45s;
        }

        /* CTAs */
        .hp-cta-row {
          display: flex; gap: 14px; flex-wrap: wrap; align-items: center;
          margin-bottom: 56px;
          opacity: 0; animation: fadeSlideUp .7s ease forwards .6s;
        }
        .hp-cta-btn { border-radius: 4px; padding: 13px 28px; }
        .hp-wa-btn { border-color: rgba(37,211,102,0.35); color: #25d366; background: rgba(37,211,102,0.08); }
        .hp-wa-btn:hover { background: rgba(37,211,102,0.15); box-shadow: 0 0 16px rgba(37,211,102,.2); }

        /* Scroll hint */
        .hp-scroll-hint {
          display: flex; align-items: center; gap: 12px;
          opacity: 0; animation: fadeSlideUp .7s ease forwards .8s;
        }
        .hp-scroll-hint__line { width: 40px; height: 1px; background: rgba(255,255,255,.2); }
        .hp-scroll-hint__text { font-size: 10.5px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-muted); }

        /* Mobile hero — bottles show, text at bottom */
        @media (max-width: 768px) {
          .hp-hero { align-items: flex-end; background-position: 72% center; min-height: 100svh; }
          .hp-hero__grad-lr {
            background: linear-gradient(to top,
              rgba(7,26,29,0.97) 0%,
              rgba(7,26,29,0.82) 40%,
              rgba(7,26,29,0.35) 65%,
              transparent 100%
            );
          }
          .hp-hero__content { max-width: 100%; padding-top: 60px; padding-bottom: 72px; }
          .hp-title { font-size: clamp(2.2rem, 9vw, 3.2rem); }
          .hp-sub { max-width: 100%; font-size: 14px; margin-bottom: 28px; }
          .hp-cta-row { margin-bottom: 36px; gap: 10px; }
          .hp-cta-btn { padding: 12px 22px; font-size: 12px; }
          .hp-scroll-hint { display: none; }
        }

        /* ── SECTIONS ────────────────────────────────────────────── */
        .hp-section { padding: 80px 0 64px; }
        @media (max-width: 768px) { .hp-section { padding: 56px 0 44px; } }

        .hp-section__head { margin-bottom: 40px; }
        @media (max-width: 480px) { .hp-section__head { margin-bottom: 28px; } }

        .hp-section__kicker {
          display: block;
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 8px;
        }
        .hp-section__title {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 400;
          color: var(--text-primary);
        }

        /* ── VIEW ALL ────────────────────────────────────────────── */
        .hp-view-all { text-align: center; margin-top: 48px; }
        @media (max-width: 480px) { .hp-view-all { margin-top: 32px; } }

        /* ── TRUST STRIP ─────────────────────────────────────────── */
        .hp-trust {
          padding: 60px 0;
          border-top: 1px solid rgba(255,255,255,.06);
          border-bottom: 1px solid rgba(255,255,255,.06);
          background: rgba(11,47,51,.25);
        }
        .hp-trust__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) { .hp-trust__grid { grid-template-columns: repeat(2,1fr); gap: 20px; } }
        @media (max-width: 480px) { .hp-trust__grid { grid-template-columns: 1fr 1fr; gap: 14px; } }

        .hp-trust__card {
          background: rgba(255,255,255,.02);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 10px;
          padding: 28px 20px;
          transition: border-color .3s, box-shadow .3s;
        }
        .hp-trust__card:hover {
          border-color: rgba(0,194,199,.3);
          box-shadow: 0 0 20px rgba(0,194,199,.08);
        }
        .hp-trust__icon { font-size: 1.8rem; display: block; margin-bottom: 12px; }
        .hp-trust__name {
          font-family: var(--font-display);
          font-size: 1.05rem; font-weight: 500;
          color: var(--text-primary); margin-bottom: 6px;
        }
        .hp-trust__desc { font-size: 13px; color: var(--text-secondary); line-height: 1.55; }

        @media (max-width: 480px) {
          .hp-trust { padding: 44px 0; }
          .hp-trust__card { padding: 20px 14px; }
          .hp-trust__icon { font-size: 1.5rem; }
          .hp-trust__name { font-size: .95rem; }
          .hp-trust__desc { font-size: 12px; }
        }
      `}</style>
    </>
  );
}
