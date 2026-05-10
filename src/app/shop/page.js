'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

const CATEGORIES = ['Whisky', 'Wine', 'Beer', 'Vodka', 'Rum', 'Gin', 'Tequila', 'Champagne', 'Brandy', 'RTD', 'Liqueur'];
const SIZES = ['180ml', '375ml', '750ml'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest' },
];

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('popular');
  
  const [filters, setFilters] = useState({
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
    stockFilter: 'all', // 'all' | 'in_stock' | 'out_of_stock'
    priceMax: 50000,
    brands: [],
    sizes: [],
    types: [],
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (searchQuery) query.set('search', searchQuery);
        if (filters.categories.length > 0) query.set('category', filters.categories[0]);
        if (sortBy) query.set('sort', sortBy);
        query.set('limit', '100');
        
        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          let filtered = data.data;
          
          if (filters.stockFilter === 'in_stock') {
            filtered = filtered.filter(p => p.available);
          } else if (filters.stockFilter === 'out_of_stock') {
            filtered = filtered.filter(p => !p.available);
          }
          if (filters.priceMax < 50000) {
            filtered = filtered.filter(p => (p.price_range?.min || 0) <= filters.priceMax);
          }
          if (filters.sizes.length > 0) {
            filtered = filtered.filter(p => p.sizes?.some(s => filters.sizes.includes(s)));
          }
          
          setTotalCount(data.total || filtered.length);
          setProducts(filtered);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    
    const t = setTimeout(fetchProducts, 200);
    return () => clearTimeout(t);
  }, [filters, searchQuery, sortBy]);

  // Sync URL params
  useEffect(() => {
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    if (s !== null) setSearchQuery(s);
    if (c) setFilters(prev => ({ ...prev, categories: [c] }));
  }, [searchParams]);

  const handleSizeToggle = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const clearFilters = () => {
    setFilters({ categories: [], stockFilter: 'all', priceMax: 50000, brands: [], sizes: [], types: [] });
    setSearchQuery('');
    router.push('/shop');
  };

  const activeCategory = filters.categories[0] || 'All';

  // Filter Panel — matches reference exactly
  const FilterPanel = ({ isMobile = false }) => (
    <div className={isMobile ? '' : 'shop-filter-panel'}>
      {!isMobile && (
        <div className="shop-filter-logo">
          Dinesh<span>.</span>
        </div>
      )}
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Filters</h3>
          <button onClick={() => setMobileFilterOpen(false)} style={{ fontSize: '24px', color: 'var(--text-secondary)' }}>×</button>
        </div>
      )}

      {/* STOCK */}
      <div className="shop-filter-section">
        <div className="shop-filter-title">STOCK</div>
        {['all', 'in_stock', 'out_of_stock'].map(opt => (
          <label key={opt} className="shop-filter-radio">
            <input
              type="radio"
              name="stock"
              checked={filters.stockFilter === opt}
              onChange={() => setFilters(prev => ({ ...prev, stockFilter: opt }))}
            />
            <span className="shop-filter-radio__dot" />
            {opt === 'all' ? 'All' : opt === 'in_stock' ? 'In stock' : 'Out of stock'}
          </label>
        ))}
      </div>

      {/* MAX PRICE */}
      <div className="shop-filter-section">
        <div className="shop-filter-title">MAX PRICE · ₹{filters.priceMax.toLocaleString('en-IN')}</div>
        <input
          type="range"
          min="500"
          max="50000"
          step="500"
          value={filters.priceMax}
          onChange={(e) => setFilters(prev => ({ ...prev, priceMax: Number(e.target.value) }))}
          className="shop-filter-slider"
        />
        <div className="shop-filter-slider-labels">
          <span>₹500</span>
          <span>₹50,000</span>
        </div>
      </div>

      {/* SIZE */}
      <div className="shop-filter-section">
        <div className="shop-filter-title">SIZE</div>
        <div className="shop-filter-sizes">
          {SIZES.map(size => (
            <button
              key={size}
              className={`shop-filter-size-btn ${filters.sizes.includes(size) ? 'active' : ''}`}
              onClick={() => handleSizeToggle(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* CLEAR ALL */}
      <button className="shop-filter-clear" onClick={clearFilters}>
        CLEAR ALL FILTERS
      </button>

      {isMobile && (
        <button className="btn btn-accent btn-full" style={{ marginTop: '16px' }} onClick={() => setMobileFilterOpen(false)}>
          Show {products.length} Results
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Product Count Bar */}
      <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {products.length} of {totalCount} products
        </div>
      </div>

      <div className="container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
        <div className="shop-layout">
          {/* Left Filter Panel — Desktop */}
          <aside className="shop-sidebar">
            <FilterPanel />
          </aside>

          {/* Right Content */}
          <main className="shop-main">
            {/* Search + Sort Bar */}
            <div className="shop-toolbar">
              <div className="shop-search-wrap">
                <svg className="shop-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  type="search"
                  className="shop-search-input"
                  placeholder={`Search within ${activeCategory}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              className="shop-mobile-filter-btn"
              onClick={() => setMobileFilterOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filter &amp; Sort
            </button>

            {/* Product Grid */}
            {loading ? (
              <div className="grid-products">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)' }} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid-products" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🍷</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '12px' }}>No products found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Try adjusting your filters or search terms.
                </p>
                <button onClick={clearFilters} className="btn btn-outline">Clear All Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <div className={`mobile-filter-overlay ${mobileFilterOpen ? 'open' : ''}`} onClick={() => setMobileFilterOpen(false)} />
      <div className={`mobile-filter-sheet ${mobileFilterOpen ? 'open' : ''}`}>
        <FilterPanel isMobile={true} />
      </div>

      <style>{`
        .shop-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          align-items: start;
        }
        .shop-sidebar {
          position: sticky;
          top: 110px;
        }

        /* Filter Panel */
        .shop-filter-panel {
          background: rgba(11,47,51,0.4);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 28px 20px;
        }
        .shop-filter-logo {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 500;
          font-style: italic;
          color: var(--text-primary);
          margin-bottom: 32px;
          text-align: center;
        }
        .shop-filter-logo span { color: var(--accent); }

        .shop-filter-section {
          margin-bottom: 28px;
        }
        .shop-filter-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-primary);
          margin-bottom: 14px;
        }

        /* Radio buttons */
        .shop-filter-radio {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 0;
          cursor: pointer;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .shop-filter-radio input {
          display: none;
        }
        .shop-filter-radio__dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid var(--text-secondary);
          position: relative;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }
        .shop-filter-radio input:checked + .shop-filter-radio__dot {
          border-color: var(--accent);
        }
        .shop-filter-radio input:checked + .shop-filter-radio__dot::after {
          content: '';
          position: absolute;
          top: 3px; left: 3px;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
        }

        /* Slider */
        .shop-filter-slider {
          width: 100%;
          accent-color: var(--accent);
          cursor: pointer;
          margin-bottom: 6px;
        }
        .shop-filter-slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Size pills */
        .shop-filter-sizes {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .shop-filter-size-btn {
          padding: 6px 14px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .shop-filter-size-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .shop-filter-size-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--bg-primary);
        }

        /* Clear button */
        .shop-filter-clear {
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          background: transparent;
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }
        .shop-filter-clear:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        /* Toolbar */
        .shop-toolbar {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        .shop-search-wrap {
          flex: 1;
          position: relative;
        }
        .shop-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .shop-search-input {
          width: 100%;
          height: 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 0 16px 0 40px;
          color: var(--text-primary);
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .shop-search-input:focus {
          border-color: var(--accent);
          outline: none;
          box-shadow: 0 0 0 2px rgba(0,194,199,0.1);
        }
        .shop-search-input::placeholder {
          color: var(--text-muted);
        }
        .shop-sort-select {
          height: 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 0 32px 0 14px;
          color: var(--text-primary);
          font-size: 13px;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300C2C7' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          min-width: 140px;
        }
        .shop-sort-select option {
          background: var(--bg-primary);
        }

        /* Mobile filter button */
        .shop-mobile-filter-btn {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          margin-bottom: 20px;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
        }

        @media (max-width: 900px) {
          .shop-layout {
            grid-template-columns: 1fr;
          }
          .shop-sidebar { display: none; }
          .shop-mobile-filter-btn { display: flex; }
          .grid-products { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .grid-products { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '120px 0' }}>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
