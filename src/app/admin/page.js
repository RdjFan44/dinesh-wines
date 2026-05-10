import Link from 'next/link';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export const metadata = { title: 'Dashboard — Dinesh Wines Admin' };

async function getStats() {
  try {
    await dbConnect();
    const [total, available, featured, categories] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ available: true }),
      Product.countDocuments({ featured: true }),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ]);
    return { total, available, unavailable: total - available, featured, categories };
  } catch {
    return { total: 0, available: 0, unavailable: 0, featured: 0, categories: [] };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: '🍾', color: 'var(--gold)' },
    { label: 'Available', value: stats.available, icon: '✅', color: '#5cb85c' },
    { label: 'Unavailable', value: stats.unavailable, icon: '❌', color: '#e05454' },
    { label: 'Featured', value: stats.featured, icon: '⭐', color: '#e8c96d' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Overview of your catalog</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/admin/products/add" className="btn btn-gold btn-sm" id="dashboard-add-product-btn">
            + Add Product
          </Link>
          <Link href="/admin/products" className="btn btn-outline btn-sm">
            Manage Products
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            borderTop: `3px solid ${card.color}`,
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{card.icon}</div>
            <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', color: card.color, fontWeight: 600 }}>
              {card.value}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      {stats.categories.length > 0 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '28px',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
            By Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.categories.map((cat) => (
              <div key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '120px', fontSize: '13px', color: 'var(--text-secondary)' }}>{cat._id}</div>
                <div style={{ flex: 1, height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (cat.count / stats.total) * 100)}%`,
                    background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))',
                    borderRadius: '4px',
                  }} />
                </div>
                <div style={{ width: '30px', textAlign: 'right', fontSize: '13px', color: 'var(--gold)', fontWeight: 600 }}>
                  {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions / seeder tip */}
      {stats.total === 0 && (
        <div style={{
          background: 'rgba(201,168,76,0.06)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          marginTop: '24px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>No products yet</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Seed the database with sample data, or add products manually.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/api/seed" className="btn btn-gold btn-sm" id="dashboard-seed-btn">Seed Database</a>
            <Link href="/admin/products/add" className="btn btn-outline btn-sm">Add Product Manually</Link>
          </div>
        </div>
      )}
    </div>
  );
}
