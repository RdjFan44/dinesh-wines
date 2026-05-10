'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CATEGORIES = ['All', 'Whisky', 'Wine', 'Beer', 'Rum', 'Gin', 'Vodka', 'Tequila', 'Champagne', 'Brandy', 'Liqueur'];

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`"${name}" deleted`);
        fetchProducts();
      } else {
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleAvailability = async (id, currentAvailable) => {
    setToggling(id);
    try {
      const res = await fetch(`/api/admin/products/${id}/availability`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, available: data.data.available } : p))
        );
      } else {
        showToast('Failed to toggle availability', 'error');
      }
    } catch {
      showToast('Failed to toggle availability', 'error');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`} style={{ zIndex: 9999 }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Products
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {pagination.total} product{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/admin/products/add" className="btn btn-gold btn-sm" id="admin-add-product-btn">
          + Add Product
        </Link>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          id="admin-products-search"
          className="input"
          style={{ flex: 1, minWidth: '180px' }}
          placeholder="Search by name or brand…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          id="admin-category-filter"
          className="input"
          style={{ width: 'auto', minWidth: '150px' }}
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Image', 'Name', 'Category', 'Brand', 'Price Range', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} style={{ padding: '16px' }}>
                        <div className="skeleton" style={{ height: '14px', width: j === 0 ? '50px' : '80%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products found.{' '}
                    <Link href="/admin/products/add" style={{ color: 'var(--gold)' }}>Add one</Link> or{' '}
                    <a href="/api/seed" style={{ color: 'var(--gold)' }}>seed the database</a>.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Image */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ width: '44px', height: '58px', borderRadius: '4px', overflow: 'hidden', background: '#111', position: 'relative' }}>
                        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="44px" />
                      </div>
                    </td>

                    {/* Name */}
                    <td style={{ padding: '12px 16px', maxWidth: '200px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </div>
                      {product.featured && (
                        <span style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.08em' }}>⭐ Featured</span>
                      )}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {product.category}
                      {product.subcategory && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{product.subcategory}</div>}
                    </td>

                    {/* Brand */}
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {product.brand}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-display)', fontSize: '14px' }}>
                        ₹{product.price_range.min.toLocaleString('en-IN')} – ₹{product.price_range.max.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        id={`toggle-${product._id}`}
                        onClick={() => handleToggleAvailability(product._id, product.available)}
                        disabled={toggling === product._id}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '100px',
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          cursor: 'pointer',
                          border: 'none',
                          background: product.available ? 'rgba(92,184,92,0.15)' : 'rgba(224,84,84,0.15)',
                          color: product.available ? '#5cb85c' : '#e05454',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderColor: product.available ? 'rgba(92,184,92,0.4)' : 'rgba(224,84,84,0.4)',
                          opacity: toggling === product._id ? 0.5 : 1,
                          transition: 'all 0.2s',
                          minWidth: '88px',
                        }}
                        title="Click to toggle availability"
                      >
                        {toggling === product._id ? '…' : product.available ? '● Available' : '● Unavailable'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          style={{
                            padding: '6px 14px',
                            fontSize: '12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--gold-muted)',
                            border: '1px solid var(--border-gold)',
                            color: 'var(--gold)',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          id={`delete-${product._id}`}
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deleting === product._id}
                          style={{
                            padding: '6px 14px',
                            fontSize: '12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(224,84,84,0.08)',
                            border: '1px solid rgba(224,84,84,0.3)',
                            color: '#e05454',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: deleting === product._id ? 0.5 : 1,
                          }}
                        >
                          {deleting === product._id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn${page === i + 1 ? ' active' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
