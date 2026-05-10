'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { name: 'Beer', image: '/Category Image Beer.png', path: '/shop?category=Beer' },
  { name: 'Wine', image: '/Category Image Wine.png', path: '/shop?category=Wine' },
  { name: 'Whisky', image: '/Category Image Whiskey.png', path: '/shop?category=Whisky' },
  { name: 'Vodka', image: '/Category Image Vodka.png', path: '/shop?category=Vodka' },
  { name: 'Rum', image: '/Category Image Rum.png', path: '/shop?category=Rum' },
  { name: 'Gin', image: '/Category Image Gin.png', path: '/shop?category=Gin' },
  { name: 'Tequila', image: '/Category Image Tequila.png', path: '/shop?category=Tequila' },
  { name: 'Champagne', image: '/Category Image Champagne.png', path: '/shop?category=Champagne' },
  { name: 'Liqueur', image: '/Category Image RTD.png', path: '/shop?category=Liqueur' },
  { name: 'RTD', image: '/Category Image RTD.png', path: '/shop?category=RTD' },
  { name: 'Brandy', image: '/Category Image Brandy.png', path: '/shop?category=Brandy' },
];

export default function CategoryScroll() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);

  const scroll = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const scrollAmount = 340; // roughly one card + gap
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="scroll-arrow scroll-arrow--left"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="scroll-arrow scroll-arrow--right"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}

      {/* Scrollable track */}
      <div className="horizontal-scroll-wrap" ref={trackRef}>
        <div className="horizontal-scroll-track">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.path} className="cat-card-h">
              <div className="cat-card-h__img">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="320px"
                  style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
                <div className="cat-card-h__overlay" />
              </div>
              <div className="cat-card-h__label">
                <span className="cat-card-h__explore">EXPLORE</span>
                <span className="cat-card-h__name">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .scroll-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(7,26,29,0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .scroll-arrow:hover {
          border-color: var(--accent);
          color: var(--accent);
          box-shadow: 0 0 16px rgba(0,194,199,0.25);
        }
        .scroll-arrow--left { left: 12px; }
        .scroll-arrow--right { right: 12px; }

        .horizontal-scroll-wrap {
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
          padding: 0 32px;
        }
        .horizontal-scroll-wrap::-webkit-scrollbar { display: none; }

        .horizontal-scroll-track {
          display: flex;
          gap: 20px;
          min-width: min-content;
          padding-bottom: 8px;
        }

        .cat-card-h {
          position: relative;
          display: block;
          text-decoration: none;
          flex-shrink: 0;
          width: 300px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.4s, box-shadow 0.4s;
        }
        .cat-card-h:hover {
          border-color: var(--accent);
          box-shadow: 0 0 25px rgba(0,194,199,0.25), inset 0 0 25px rgba(0,194,199,0.05);
        }
        .cat-card-h:hover .cat-card-h__img img { transform: scale(1.05); }

        .cat-card-h__img {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
        }
        .cat-card-h__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(7,26,29,0.75) 0%, transparent 60%);
        }
        .cat-card-h__label {
          position: absolute;
          bottom: 20px; left: 24px;
          display: flex; flex-direction: column; gap: 2px;
          z-index: 2;
        }
        .cat-card-h__explore {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--accent);
        }
        .cat-card-h__name {
          font-family: var(--font-display);
          font-size: 1.3rem; font-weight: 500;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .cat-card-h { width: 260px; }
          .horizontal-scroll-wrap { padding: 0 16px; }
          .scroll-arrow { width: 36px; height: 36px; }
          .scroll-arrow--left { left: 6px; }
          .scroll-arrow--right { right: 6px; }
        }
      `}</style>
    </div>
  );
}
