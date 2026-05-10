'use client';

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

export default function ProductForm({ initialData = {}, onSubmit, loading, submitLabel = 'Save Product' }) {
  const blank = {
    name: '',
    category: 'Whisky',
    subcategory: '',
    brand: '',
    price_range: { min: '', max: '' },
    description: '',
    image: '',
    alcoholContent: '',
    volume: '750ml',
    origin: '',
    featured: false,
    available: true,
    tags: '',
    ...initialData,
    price_range: {
      min: initialData?.price_range?.min || '',
      max: initialData?.price_range?.max || '',
    },
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'price_min') {
      onSubmit.setForm((f) => ({ ...f, price_range: { ...f.price_range, min: value } }));
    } else if (name === 'price_max') {
      onSubmit.setForm((f) => ({ ...f, price_range: { ...f.price_range, max: value } }));
    } else {
      onSubmit.setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const form = onSubmit.form;
  const subCats = SUBCATEGORIES[form.category] || [];

  const inputStyle = { padding: '12px 14px' };

  return (
    <form id="product-form" onSubmit={onSubmit.handleSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Name */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="pf-name">Product Name *</label>
          <input id="pf-name" className="input" name="name" style={inputStyle}
            placeholder="e.g. Glenfiddich 12 Year Old" value={form.name} onChange={handleChange} required />
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="pf-category">Category *</label>
          <select id="pf-category" className="input" name="category" style={inputStyle}
            value={form.category} onChange={handleChange} required>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Subcategory */}
        <div className="form-group">
          <label className="form-label" htmlFor="pf-subcategory">Subcategory</label>
          <select id="pf-subcategory" className="input" name="subcategory" style={inputStyle}
            value={form.subcategory} onChange={handleChange}>
            <option value="">— Select subcategory —</option>
            {subCats.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Brand */}
        <div className="form-group">
          <label className="form-label" htmlFor="pf-brand">Brand *</label>
          <input id="pf-brand" className="input" name="brand" style={inputStyle}
            placeholder="e.g. Glenfiddich" value={form.brand} onChange={handleChange} required />
        </div>

        {/* Origin */}
        <div className="form-group">
          <label className="form-label" htmlFor="pf-origin">Origin</label>
          <input id="pf-origin" className="input" name="origin" style={inputStyle}
            placeholder="e.g. Scotland" value={form.origin} onChange={handleChange} />
        </div>

        {/* Price Min */}
        <div className="form-group">
          <label className="form-label" htmlFor="pf-price-min">Min Price (₹) *</label>
          <input id="pf-price-min" className="input" name="price_min" type="number" style={inputStyle}
            placeholder="e.g. 2000" value={form.price_range.min} onChange={handleChange} required min="0" />
        </div>

        {/* Price Max */}
        <div className="form-group">
          <label className="form-label" htmlFor="pf-price-max">Max Price (₹) *</label>
          <input id="pf-price-max" className="input" name="price_max" type="number" style={inputStyle}
            placeholder="e.g. 3000" value={form.price_range.max} onChange={handleChange} required min="0" />
        </div>

        {/* Alcohol Content */}
        <div className="form-group">
          <label className="form-label" htmlFor="pf-alcohol">Alcohol Content</label>
          <input id="pf-alcohol" className="input" name="alcoholContent" style={inputStyle}
            placeholder="e.g. 40%" value={form.alcoholContent} onChange={handleChange} />
        </div>

        {/* Volume */}
        <div className="form-group">
          <label className="form-label" htmlFor="pf-volume">Volume</label>
          <input id="pf-volume" className="input" name="volume" style={inputStyle}
            placeholder="e.g. 750ml" value={form.volume} onChange={handleChange} />
        </div>

        {/* Description */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="pf-description">Description *</label>
          <textarea id="pf-description" className="input" name="description" style={inputStyle}
            placeholder="Describe the product…" value={form.description} onChange={handleChange} required rows={4} />
        </div>

        {/* Image URL */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="pf-image">Image URL *</label>
          <input id="pf-image" className="input" name="image" type="url" style={inputStyle}
            placeholder="https://images.unsplash.com/…" value={form.image} onChange={handleChange} required />
          {form.image && (
            <div style={{ marginTop: '10px', width: '80px', height: '104px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', background: '#111' }}>
              <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Paste an Unsplash URL like <code style={{ color: 'var(--gold)' }}>https://images.unsplash.com/photo-XXXXX?w=600&h=800&fit=crop</code>
          </p>
        </div>

        {/* Tags */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="pf-tags">Tags (comma-separated)</label>
          <input id="pf-tags" className="input" name="tags" style={inputStyle}
            placeholder="e.g. scotch, single malt, premium" value={form.tags} onChange={handleChange} />
        </div>

        {/* Toggles */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {[
            { name: 'featured', label: 'Featured Product', desc: 'Show on homepage featured section' },
            { name: 'available', label: 'Available', desc: 'Visible on public catalog' },
          ].map((toggle) => (
            <label key={toggle.name} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name={toggle.name}
                id={`pf-${toggle.name}`}
                checked={form[toggle.name]}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{toggle.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{toggle.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
        <button
          id="product-form-submit"
          type="submit"
          className="btn btn-gold"
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Saving…' : submitLabel}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => window.history.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
