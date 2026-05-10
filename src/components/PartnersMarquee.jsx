'use client';

// Placeholder partner slots — replace images when ready
const partners = [
  { name: 'Partner 1', image: null },
  { name: 'Partner 2', image: null },
  { name: 'Partner 3', image: null },
  { name: 'Partner 4', image: null },
  { name: 'Partner 5', image: null },
  { name: 'Partner 6', image: null },
  { name: 'Partner 7', image: null },
  { name: 'Partner 8', image: null },
];

export default function PartnersMarquee() {
  // Duplicate for infinite scroll illusion
  const items = [...partners, ...partners];

  return (
    <>
      <div className="marquee-container">
        <div className="marquee-track">
          {items.map((partner, i) => (
            <div key={i} className="marquee-item">
              {partner.image ? (
                <img src={partner.image} alt={partner.name} className="marquee-img" />
              ) : (
                <div className="marquee-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>{partner.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-container {
          overflow: hidden;
          padding: 0 0 8px;
        }
        .marquee-track {
          display: flex;
          gap: 48px;
          animation: marqueeScroll 30s linear infinite;
          width: max-content;
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marquee-img {
          height: 50px;
          width: auto;
          object-fit: contain;
          filter: grayscale(1) brightness(0.7);
          opacity: 0.5;
          transition: filter 0.3s, opacity 0.3s;
        }
        .marquee-item:hover .marquee-img {
          filter: grayscale(0) brightness(1);
          opacity: 1;
        }

        .marquee-placeholder {
          width: 160px;
          height: 80px;
          border: 1px dashed rgba(255,255,255,0.12);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: border-color 0.3s, color 0.3s;
        }
        .marquee-item:hover .marquee-placeholder {
          border-color: var(--accent);
          color: var(--accent);
        }
      `}</style>
    </>
  );
}
