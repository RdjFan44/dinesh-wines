import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Product Details | Dinesh Wines',
};

async function getProduct(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : product.image || 'https://images.unsplash.com/photo-1569529465841-df3472061caf?w=600&h=800&fit=crop';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const whatsappMessage = `Hi, I want to inquire about ${product.name}. Is it available?`;
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="container section">
      <Link href="/shop" style={{ display: 'inline-block', marginBottom: '24px', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        ← Back to Catalog
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div>
          <div className="badge badge-accent" style={{ marginBottom: '16px' }}>{product.category}</div>
          <h1 className="display-md" style={{ marginBottom: '8px' }}>{product.name}</h1>
          <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>{product.brand}</div>
          
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '32px' }}>
            {product.price_range?.min && product.price_range?.max 
              ? `${formatPrice(product.price_range.min)} - ${formatPrice(product.price_range.max)}`
              : formatPrice(product.price_range?.min || 0)}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.8', marginBottom: '40px' }}>
            {product.description || 'Premium spirit available at our licensed retail store.'}
          </p>

          <div className="product-specs">
            {product.alcoholContent && (
              <div className="product-spec">
                <div className="product-spec-label">ABV</div>
                <div className="product-spec-value">{product.alcoholContent}</div>
              </div>
            )}
            {product.origin && (
              <div className="product-spec">
                <div className="product-spec-label">Origin</div>
                <div className="product-spec-value">{product.origin}</div>
              </div>
            )}
            <div className="product-spec">
              <div className="product-spec-label">Availability</div>
              <div className="product-spec-value" style={{ color: product.available ? 'var(--green)' : 'var(--red)' }}>
                {product.available ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
            {(product.volume || (product.sizes && product.sizes.length > 0)) && (
              <div className="product-spec">
                <div className="product-spec-label">Volume</div>
                <div className="product-spec-value">
                  {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : product.volume}
                </div>
              </div>
            )}
          </div>

          <div className="store-actions" style={{ marginTop: '40px' }}>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="store-action-btn whatsapp">
              Ask on WhatsApp
            </a>
            <a href="tel:+919876543210" className="store-action-btn call">
              Call Store
            </a>
          </div>

          <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Important:</strong> Dinesh Wines does not sell or deliver alcohol directly. You must visit our licensed retail store to purchase. 21+ only.
          </div>
        </div>
      </div>
    </div>
  );
}
