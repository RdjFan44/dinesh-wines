'use client';
import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = ['All', 'Whisky', 'Wine', 'Beer', 'Rum', 'Gin', 'Vodka', 'Tequila', 'Champagne', 'Brandy', 'Liqueur'];
const BRANDS_MAP = {
  Whisky: ['Glenfiddich', 'Macallan', 'Jack Daniel\'s', 'Johnnie Walker', 'Paul John'],
  Wine: ['Jacob\'s Creek', 'Santa Carolina', 'Sula Vineyards'],
  Beer: ['Kingfisher', 'Heineken'],
  Rum: ['Old Monk', 'Bacardi'],
  Gin: ['Bombay Sapphire', 'Gordon\'s'],
  Vodka: ['Grey Goose', 'Absolut'],
  Tequila: ['Don Julio', 'Patron'],
  Champagne: ['Moët & Chandon'],
};

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Latest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
];

export default function ProductFilters({ onFiltersChange }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || 30000);
  const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt');

  const updateFilters = useCallback((newCategory, newMax, newSort) => {
    const params = new URLSearchParams();
    if (newCategory && newCategory !== 'All') params.set('category', newCategory);
    if (newMax < 30000) params.set('maxPrice', newMax);
    if (newSort !== 'createdAt') params.set('sort', newSort);
    params.set('page', '1');

    router.push(`/products?${params.toString()}`, { scroll: false });
    if (onFiltersChange) onFiltersChange({ category: newCategory, maxPrice: newMax, sort: newSort });
  }, [router, onFiltersChange]);

  const handleCategory = (cat) => {
    setCategory(cat);
    updateFilters(cat, maxPrice, sort);
  };

  const handleMaxPrice = (val) => {
    setMaxPrice(val);
    updateFilters(category, val, sort);
  };

  const handleSort = (val) => {
    setSort(val);
    updateFilters(category, maxPrice, val);
  };

  const handleReset = () => {
    setCategory('All');
    setMaxPrice(30000);
    setSort('createdAt');
    router.push('/products', { scroll: false });
  };

  return (
    <aside className="filters-panel" aria-label="Product filters">
      {/* Sort */}
      <div className="filter-section">
        <h3 className="filter-title">Sort By</h3>
        <select
          id="sort-select"
          className="input"
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="filter-section">
        <h3 className="filter-title">Category</h3>
        <div role="group" aria-label="Product categories">
          {CATEGORIES.map((cat) => (
            <label key={cat} className={`filter-option${category === cat ? ' active' : ''}`}>
              <input
                type="radio"
                name="category"
                value={cat}
                checked={category === cat}
                onChange={() => handleCategory(cat)}
                style={{ accentColor: 'var(--gold)' }}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h3 className="filter-title">Max Price</h3>
        <div className="price-range-display">
          <span>₹0</span>
          <span style={{ color: 'var(--gold)' }}>
            {maxPrice >= 30000 ? 'Any' : `₹${Number(maxPrice).toLocaleString('en-IN')}`}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min={500}
          max={30000}
          step={500}
          value={maxPrice}
          onChange={(e) => handleMaxPrice(e.target.value)}
          className="range-slider"
          aria-label="Maximum price filter"
          aria-valuemin={500}
          aria-valuemax={30000}
          aria-valuenow={maxPrice}
        />
      </div>

      {/* Reset */}
      <button
        id="filters-reset-btn"
        className="btn btn-ghost btn-full btn-sm"
        onClick={handleReset}
        style={{ marginTop: '8px' }}
      >
        Reset Filters
      </button>
    </aside>
  );
}
