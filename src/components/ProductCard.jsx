'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image ||
        'https://images.unsplash.com/photo-1569529465841-df3472061caf?w=600&h=800&fit=crop';

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  const whatsappMsg = `Hi, I want to inquire about ${product.name}. Is it available?`;
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMsg)}`;

  const priceText =
    product.price_range?.min && product.price_range?.max
      ? `${formatPrice(product.price_range.min)} – ${formatPrice(product.price_range.max)}`
      : formatPrice(product.price_range?.min || 0);

  return (
    <Link href={`/shop/${product._id}`} className="pc" aria-label={`View ${product.name}`}>
      {/* Image area */}
      <div className="pc__img-wrap">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 22vw"
          style={{ objectFit: 'cover' }}
        />
        {/* gradient overlay */}
        <div className="pc__img-overlay" />
        {/* shine sweep on hover */}
        <div className="pc__shine" />

        {product.featured && <span className="pc__badge">Featured</span>}
        {!product.available && <span className="pc__badge pc__badge--out">Unavailable</span>}
      </div>

      {/* Body */}
      <div className="pc__body">
        <p className="pc__cat">{product.category}</p>
        <h3 className="pc__name">{product.name}</h3>
        {product.brand && <p className="pc__brand">{product.brand}</p>}
        <p className="pc__price">{priceText}</p>

        <div className="pc__footer">
          <button
            className="pc__wa"
            onClick={(e) => {
              e.preventDefault();
              window.open(whatsappUrl, '_blank');
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Ask on WhatsApp
          </button>
        </div>
      </div>

      <style>{`
        .pc {
          display: block;
          text-decoration: none;
          background: rgba(11,47,51,0.4);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color .35s ease, box-shadow .35s ease, transform .35s ease;
          cursor: pointer;
          position: relative;
        }
        .pc:hover {
          border-color: rgba(0,194,199,0.55);
          box-shadow: 0 16px 40px rgba(0,0,0,0.45), 0 0 24px rgba(0,194,199,0.15);
          transform: translateY(-5px);
        }

        /* Image */
        .pc__img-wrap {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #040d0e;
        }
        .pc__img-wrap img { transition: transform .6s cubic-bezier(.4,0,.2,1) !important; }
        .pc:hover .pc__img-wrap img { transform: scale(1.07) !important; }

        .pc__img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(7,26,29,0.92) 0%, rgba(7,26,29,0.1) 50%, transparent 100%);
          transition: opacity .35s;
        }
        .pc:hover .pc__img-overlay {
          background: linear-gradient(to top, rgba(7,26,29,0.95) 0%, rgba(0,194,199,0.08) 55%, transparent 100%);
        }

        /* Shine sweep */
        .pc__shine {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0s;
        }
        .pc:hover .pc__shine {
          transform: translateX(100%);
          transition: transform .55s ease;
        }

        /* Badges */
        .pc__badge {
          position: absolute;
          top: 12px; left: 12px;
          padding: 3px 9px;
          background: var(--accent);
          color: var(--bg-primary);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .pc__badge--out {
          background: rgba(224,84,84,0.85);
          color: #fff;
          left: auto; right: 12px;
        }

        /* Body */
        .pc__body { padding: 16px 18px 18px; }
        .pc__cat {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 7px;
        }
        .pc__name {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 500;
          line-height: 1.35;
          color: var(--text-primary);
          margin-bottom: 5px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pc__brand {
          font-size: 11.5px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }
        .pc__price {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 14px;
          font-weight: 500;
        }

        /* Footer / WhatsApp */
        .pc__footer { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 14px; }
        .pc__wa {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          padding: 9px 12px;
          border-radius: 5px;
          background: rgba(37,211,102,0.08);
          border: 1px solid rgba(37,211,102,0.18);
          color: #25d366;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background .2s, box-shadow .2s, transform .2s;
          font-family: var(--font-body);
        }
        .pc__wa:hover {
          background: rgba(37,211,102,0.16);
          box-shadow: 0 0 14px rgba(37,211,102,0.25);
          transform: scale(1.02);
        }

        /* Mobile adjustments */
        @media (max-width: 480px) {
          .pc { border-radius: 8px; }
          .pc__body { padding: 12px 14px 14px; }
          .pc__name { font-size: 0.95rem; }
          .pc__price { font-size: 0.9rem; margin-bottom: 12px; }
          .pc__wa { font-size: 10.5px; padding: 8px 10px; }
        }
      `}</style>
    </Link>
  );
}
