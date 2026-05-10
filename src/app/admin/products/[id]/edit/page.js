'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = ['Whisky', 'Wine', 'Beer', 'Rum', 'Gin', 'Vodka', 'Tequila', 'Champagne', 'Brandy', 'Liqueur'];
const SUBCATEGORIES = {
  Whisky: ['Single Malt', 'Blended Scotch', 'Indian Whisky', 'Irish Whiskey', 'Japanese Whiskey', 'American Whiskey', 'Canadian Whisky'],
  Wine: ['Red Wine', 'White Wine', 'Rosé', 'Sparkling Wine'],
  Beer: ['Lager', 'Wheat', 'Stout', 'IPA', 'Others'],
  Rum: ['Dark Rum', 'White Rum', 'Spiced Rum'],
  Gin: ['London Dry', 'World Gin', 'Old Tom'],
  Vodka: ['Unflavoured', 'Flavoured'],
  Tequila: ['Blanco', 'Reposado', 'Añejo', 'Mezcal'],
  Champagne: ['Brut', 'Non-Vintage', 'Vintage'],
  Brandy: ['Cognac', 'Armagnac', 'Indian Brandy'],
  Liqueur: ['Fruit Liqueur', 'Cream Liqueur', 'Herbal'],
};

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (data.success) {
          const p = data.data;
          setForm({
            ...p,
            price_range: { min: p.price_range?.min || '', max: p.price_range?.max || '' },
            tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
          });
        } else {
          setError('Product not found');
        }
      } catch {
        setError('Failed to load product');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'price_min') {
      setForm((f) => ({ ...f, price_range: { ...f.price_range, min: value } }));
    } else if (name === 'price_max') {
      setForm((f) => ({ ...f, price_range: { ...f.price_range, max: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        price_range: { min: Number(form.price_range.min), max: Number(form.price_range.max) },
        tags: typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags,
      };
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Product updated successfully!');
        setTimeout(() => router.push('/admin/products'), 1200);
      } else {
        setError(data.error || 'Update failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '48px', borderRadius: 'var(--radius-sm)' }} />)}
      </div>
    );
  }
  if (!form) return <div style={{ color: 'var(--text-muted)' }}>Product not found.</div>;

  const subCats = SUBCATEGORIES[form.category] || [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <Link href="/admin/products" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>← Products</Link>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-primary)' }}>Edit Product</h2>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {id}</span>
      </div>

      {error && (
        <div style={{ background: 'rgba(224,84,84,0.1)', border: '1px solid rgba(224,84,84,0.3)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: '20px', fontSize: '14px', color: '#e05454' }} role="alert">
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(92,184,92,0.1)', border: '1px solid rgba(92,184,92,0.3)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: '20px', fontSize: '14px', color: '#5cb85c' }} role="status">
          ✅ {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
        {/* Main Form */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '32px' }}>
          <form id="edit-product-form" onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="ep-name">Product Name *</label>
                <input id="ep-name" className="input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ep-category">Category *</label>
                <select id="ep-category" className="input" name="category" value={form.category} onChange={handleChange} required>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ep-subcategory">Subcategory</label>
                <select id="ep-subcategory" className="input" name="subcategory" value={form.subcategory || ''} onChange={handleChange}>
                  <option value="">— None —</option>
                  {subCats.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ep-brand">Brand *</label>
                <input id="ep-brand" className="input" name="brand" value={form.brand} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ep-origin">Origin</label>
                <input id="ep-origin" className="input" name="origin" value={form.origin || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ep-price-min">Min Price (₹)</label>
                <input id="ep-price-min" className="input" name="price_min" type="number" value={form.price_range.min} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ep-price-max">Max Price (₹)</label>
                <input id="ep-price-max" className="input" name="price_max" type="number" value={form.price_range.max} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ep-alcohol">Alcohol Content</label>
                <input id="ep-alcohol" className="input" name="alcoholContent" value={form.alcoholContent || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ep-volume">Volume</label>
                <input id="ep-volume" className="input" name="volume" value={form.volume || ''} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="ep-description">Description *</label>
                <textarea id="ep-description" className="input" name="description" value={form.description} onChange={handleChange} required rows={4} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="ep-image">Image URL</label>
                <input id="ep-image" className="input" name="image" type="url" value={form.image || ''} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="ep-tags">Tags</label>
                <input id="ep-tags" className="input" name="tags" value={form.tags} onChange={handleChange} placeholder="comma separated tags" />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {[{ name: 'featured', label: 'Featured', desc: 'Show on homepage' }, { name: 'available', label: 'Available', desc: 'Visible in public catalog' }].map((t) => (
                  <label key={t.name} style={{ display: 'flex', gap: '10px', cursor: 'pointer', alignItems: 'flex-start' }}>
                    <input type="checkbox" name={t.name} checked={!!form[t.name]} onChange={handleChange} style={{ width: '17px', height: '17px', accentColor: 'var(--gold)', marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{t.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <button id="edit-product-submit" type="submit" className="btn btn-gold" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
            </div>
          </form>
        </div>

        {/* Preview sidebar */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', position: 'sticky', top: '80px' }}>
          <p className="label" style={{ marginBottom: '12px', display: 'block' }}>Image Preview</p>
          {form.image ? (
            <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', aspectRatio: '3/4', background: '#111', marginBottom: '16px' }}>
              <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          ) : (
            <div style={{ borderRadius: 'var(--radius-sm)', aspectRatio: '3/4', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              No image
            </div>
          )}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <strong style={{ color: form.available ? '#5cb85c' : '#e05454' }}>
              {form.available ? '● Available' : '● Unavailable'}
            </strong>
            {form.featured && <span style={{ color: 'var(--gold)', marginLeft: '12px' }}>⭐ Featured</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
