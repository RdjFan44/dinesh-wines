'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', category: 'Whisky', subcategory: '',
    brand: '', price_range: { min: '', max: '' },
    isPriceRange: false,
    description: '', image: '', images: [], files: [], alcoholContent: '',
    volume: '750ml', origin: '', featured: false,
    available: true, tags: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'price_min') {
      setForm((f) => ({ ...f, price_range: { ...f.price_range, min: value } }));
    } else if (name === 'price_max') {
      setForm((f) => ({ ...f, price_range: { ...f.price_range, max: value } }));
    } else if (type === 'file') {
      const selectedFiles = Array.from(files).slice(0, 6);
      setForm((f) => ({ ...f, files: selectedFiles }));
    } else {
      setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      const finalPriceMin = Number(form.price_range.min);
      const finalPriceMax = form.isPriceRange ? Number(form.price_range.max) : finalPriceMin;
      
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('subcategory', form.subcategory);
      formData.append('brand', form.brand);
      formData.append('description', form.description);
      formData.append('price_range', JSON.stringify({ min: finalPriceMin, max: finalPriceMax }));
      formData.append('tags', form.tags.split(',').map((t) => t.trim()).filter(Boolean).join(','));
      formData.append('alcoholContent', form.alcoholContent);
      formData.append('volume', form.volume);
      formData.append('origin', form.origin);
      formData.append('featured', form.featured);
      formData.append('available', form.available);

      if (form.files && form.files.length > 0) {
        form.files.forEach(file => {
          formData.append('files', file);
        });
      } else if (form.image) {
        formData.append('image', form.image); // fallback URL
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(data.error || 'Failed to create product');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subCats = SUBCATEGORIES[form.category] || [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <Link href="/admin/products" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>← Products</Link>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-primary)' }}>Add Product</h2>
      </div>

      {error && (
        <div style={{
          background: 'rgba(224,84,84,0.1)', border: '1px solid rgba(224,84,84,0.3)',
          borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: '24px',
          fontSize: '14px', color: '#e05454',
        }} role="alert">{error}</div>
      )}

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '32px' }}>
        <form id="add-product-form" onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="ap-name">Product Name *</label>
              <input id="ap-name" className="input" name="name" placeholder="e.g. Glenfiddich 12 Year Old" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ap-category">Category *</label>
              <select id="ap-category" className="input" name="category" value={form.category} onChange={handleChange} required>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ap-subcategory">Subcategory</label>
              <select id="ap-subcategory" className="input" name="subcategory" value={form.subcategory} onChange={handleChange}>
                <option value="">— Select subcategory —</option>
                {subCats.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ap-brand">Brand *</label>
              <input id="ap-brand" className="input" name="brand" placeholder="e.g. Glenfiddich" value={form.brand} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ap-origin">Origin</label>
              <input id="ap-origin" className="input" name="origin" placeholder="e.g. Scotland" value={form.origin} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
                <input type="checkbox" name="isPriceRange" checked={form.isPriceRange} onChange={handleChange} style={{ accentColor: 'var(--gold)' }} />
                Use a price range (Min - Max) instead of a single price
              </label>
            </div>
            {!form.isPriceRange ? (
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="ap-price">Price (₹) *</label>
                <input id="ap-price" className="input" name="price_min" type="number" placeholder="e.g. 2000" value={form.price_range.min} onChange={handleChange} required min="0" />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="ap-price-min">Min Price (₹) *</label>
                  <input id="ap-price-min" className="input" name="price_min" type="number" placeholder="e.g. 2000" value={form.price_range.min} onChange={handleChange} required min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="ap-price-max">Max Price (₹) *</label>
                  <input id="ap-price-max" className="input" name="price_max" type="number" placeholder="e.g. 3000" value={form.price_range.max} onChange={handleChange} required min="0" />
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label" htmlFor="ap-alcohol">Alcohol Content</label>
              <input id="ap-alcohol" className="input" name="alcoholContent" placeholder="e.g. 40%" value={form.alcoholContent} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ap-volume">Volume</label>
              <input id="ap-volume" className="input" name="volume" placeholder="e.g. 750ml" value={form.volume} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="ap-description">Description *</label>
              <textarea id="ap-description" className="input" name="description" placeholder="Describe the product…" value={form.description} onChange={handleChange} required rows={4} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="ap-image">Images (Up to 6) *</label>
              <input id="ap-image" className="input" name="files" type="file" accept="image/*" multiple onChange={handleChange} required={!form.image} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {form.files && form.files.length > 0 ? (
                  form.files.map((file, i) => (
                    <div key={i} style={{ width: '80px', height: '104px', borderRadius: '4px', overflow: 'hidden', border: i === 0 ? '2px solid var(--gold)' : '1px solid var(--border)', background: '#111', position: 'relative' }}>
                      <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {i === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--gold)', color: '#000', fontSize: '9px', textAlign: 'center', fontWeight: 'bold' }}>MAIN</span>}
                    </div>
                  ))
                ) : form.image ? (
                  <div style={{ width: '80px', height: '104px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)', background: '#111' }}>
                    <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : null}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Upload up to 6 images (max 50MB each). The first image will be the main image. Alternatively, enter a URL below.
              </p>
              <input className="input" name="image" type="url" placeholder="Or paste an image URL…" value={form.image} onChange={handleChange} style={{ marginTop: '8px' }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="ap-tags">Tags (comma-separated)</label>
              <input id="ap-tags" className="input" name="tags" placeholder="e.g. scotch, single malt, premium" value={form.tags} onChange={handleChange} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {[{ name: 'featured', label: 'Featured', desc: 'Show on homepage' }, { name: 'available', label: 'Available', desc: 'Visible on public catalog' }].map((t) => (
                <label key={t.name} style={{ display: 'flex', gap: '10px', cursor: 'pointer', alignItems: 'flex-start' }}>
                  <input type="checkbox" name={t.name} checked={form[t.name]} onChange={handleChange} style={{ width: '17px', height: '17px', accentColor: 'var(--gold)', marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{t.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <button id="add-product-submit" type="submit" className="btn btn-gold" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Creating…' : 'Create Product'}
            </button>
            <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
