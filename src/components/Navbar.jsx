'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const CATS = ['Beer','Whisky','Tequila','Vodka','Gin','Rum','Wine','Champagne','Liqueur','RTD','Brandy'];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery]           = useState('');
  const pathname = usePathname();
  const router   = useRouter();
  const inputRef = useRef(null);

  /* scroll listener */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* close everything on route change */
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  /* lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const doSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setSearchOpen(false);
  };

  /* don't render on admin */
  if (pathname.startsWith('/admin')) return null;

  /* active category from URL */
  let activeCategory = null;
  if (typeof window !== 'undefined') {
    activeCategory = new URLSearchParams(window.location.search).get('category');
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          LAYER 1 · TOPBAR
      ══════════════════════════════════════════════════════════ */}
      <div className={`nb-topbar${scrolled ? ' nb-topbar--hide' : ''}`}>
        <div className="nb-container nb-topbar__row">
          <div className="nb-topbar__left">
            <a href="tel:+919000000000" className="nb-topbar__link">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.19 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 18.92z"/>
              </svg>
              +91 90000 00000
            </a>
            <span className="nb-topbar__sep" />
            <span className="nb-topbar__link">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Maharashtra, India
            </span>
          </div>
          <div className="nb-topbar__right">
            <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer" className="nb-topbar__link nb-topbar__link--wa">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          LAYER 2 · MAIN HEADER
      ══════════════════════════════════════════════════════════ */}
      <header className={`nb-header${scrolled ? ' nb-header--glass' : ''}`}>
        <div className="nb-container nb-header__row">

          {/* Logo */}
          <Link href="/" className="nb-logo">
            Dinesh<span>.</span>
          </Link>

          {/* Desktop search */}
          <form className="nb-search" onSubmit={doSearch}>
            <svg className="nb-search__ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="nb-search__input"
              type="search"
              placeholder="Search whisky, gin, rum…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </form>

          {/* Right */}
          <div className="nb-header__right">
            <Link href="/contact" className="nb-nav-link nb-desktop-only">Contact</Link>
            <Link href="/shop"    className="nb-nav-link nb-desktop-only">Shop</Link>

            {/* Mobile: search icon */}
            <button className="nb-icon-btn nb-mobile-only" onClick={() => { setSearchOpen(s => !s); }} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Hamburger — mobile only */}
            <button className={`nb-burger nb-mobile-only${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile search bar drop */}
        {searchOpen && (
          <form className="nb-msearch" onSubmit={doSearch}>
            <input
              ref={inputRef}
              className="nb-msearch__input"
              type="search"
              placeholder="Search spirits, brands…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="nb-msearch__btn">Search</button>
          </form>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════
          LAYER 3 · CATEGORY STRIP
      ══════════════════════════════════════════════════════════ */}
      <nav className={`nb-catnav${scrolled ? ' nb-catnav--glass' : ''}`} aria-label="Product categories">
        <div className="nb-catnav__track">
          <Link href="/shop" className={`nb-cat${!activeCategory && pathname === '/shop' ? ' nb-cat--active' : ''}`}>All</Link>
          {CATS.map(c => (
            <Link key={c} href={`/shop?category=${c}`} className={`nb-cat${activeCategory === c ? ' nb-cat--active' : ''}`}>
              {c}
            </Link>
          ))}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          MOBILE SLIDE MENU
      ══════════════════════════════════════════════════════════ */}
      <div className={`nb-drawer${mobileOpen ? ' open' : ''}`}>
        <div className="nb-drawer__inner">
          <Link href="/"       className="nb-drawer__link nb-drawer__link--lg">Home</Link>
          <Link href="/shop"   className="nb-drawer__link nb-drawer__link--lg">Shop All</Link>
          <Link href="/contact" className="nb-drawer__link nb-drawer__link--lg">Contact</Link>

          <div className="nb-drawer__sep" />
          <p className="nb-drawer__label">Browse by Category</p>

          {CATS.map(c => (
            <Link key={c} href={`/shop?category=${c}`} className="nb-drawer__link">
              {c}
            </Link>
          ))}

          <div className="nb-drawer__sep" />
          <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer" className="nb-drawer__link" style={{color:'#25d366'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            WhatsApp Us
          </a>
        </div>
      </div>
      {mobileOpen && <div className="nb-backdrop" onClick={() => setMobileOpen(false)} />}

      {/* ══════════════════════════════════════════════════════════
          MOBILE BOTTOM NAV (Hedonne-style)
      ══════════════════════════════════════════════════════════ */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <div className="bottom-nav__inner">
          <Link href="/" className={`bottom-nav__btn${pathname === '/' ? ' active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </Link>
          <Link href="/shop" className={`bottom-nav__btn${pathname.startsWith('/shop') ? ' active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Shop
          </Link>
          <button className="bottom-nav__btn" onClick={() => { setSearchOpen(s => !s); window.scrollTo({top:0,behavior:'smooth'}); }} aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Search
          </button>
          <Link href="/contact" className={`bottom-nav__btn${pathname === '/contact' ? ' active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Contact
          </Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          STYLES
      ══════════════════════════════════════════════════════════ */}
      <style>{`
        /* ── CONTAINER ─────────────────────────────────────────── */
        .nb-container { max-width:1320px; margin:0 auto; padding:0 32px; }
        @media(max-width:768px){ .nb-container { padding:0 16px; } }

        /* ── TOPBAR ────────────────────────────────────────────── */
        .nb-topbar {
          height:36px; background:#040e10;
          border-bottom:1px solid rgba(255,255,255,.05);
          overflow:hidden; transition:height .35s ease, opacity .35s ease;
          position:relative; z-index:1002;
        }
        .nb-topbar--hide { height:0; opacity:0; }
        .nb-topbar__row { display:flex; align-items:center; justify-content:space-between; height:36px; }
        .nb-topbar__left,.nb-topbar__right { display:flex; align-items:center; gap:12px; }
        .nb-topbar__link { display:inline-flex; align-items:center; gap:5px; font-size:11.5px; color:var(--text-secondary); text-decoration:none; transition:color .2s; white-space:nowrap; }
        .nb-topbar__link:hover { color:var(--text-primary); }
        .nb-topbar__link--wa { color:#25d366; }
        .nb-topbar__link--wa:hover { color:#1aad52; }
        .nb-topbar__sep { width:1px; height:14px; background:rgba(255,255,255,.12); }

        /* ── MAIN HEADER ───────────────────────────────────────── */
        .nb-header {
          position:sticky; top:0; z-index:1001;
          background:var(--bg-primary);
          border-bottom:1px solid rgba(255,255,255,.06);
          transition:background .35s ease, backdrop-filter .35s ease, box-shadow .35s ease;
        }
        .nb-header--glass {
          background:rgba(7,26,29,.85);
          backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          box-shadow:0 4px 32px rgba(0,0,0,.3);
        }
        .nb-header__row { display:grid; grid-template-columns:auto 1fr auto; align-items:center; height:64px; gap:24px; }
        .nb-logo { font-family:var(--font-display); font-size:1.65rem; font-weight:500; font-style:italic; color:var(--text-primary); text-decoration:none; flex-shrink:0; }
        .nb-logo span { color:var(--accent); }

        /* ── DESKTOP SEARCH ────────────────────────────────────── */
        .nb-search { position:relative; display:flex; align-items:center; width:100%; max-width:520px; justify-self:center; }
        .nb-search__ico { position:absolute; left:16px; color:var(--text-muted); pointer-events:none; z-index:1; }
        .nb-search__input {
          width:100%; height:42px;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.08);
          border-radius:999px;
          padding:0 20px 0 44px;
          color:var(--text-primary); font-size:13.5px;
          font-family:var(--font-body);
          transition:border-color .2s, background .2s, box-shadow .2s;
          outline:none;
        }
        .nb-search__input::placeholder { color:var(--text-muted); }
        .nb-search__input:focus { border-color:var(--accent); background:rgba(255,255,255,.08); box-shadow:0 0 0 3px rgba(0,194,199,.09); }

        /* ── RIGHT LINKS ───────────────────────────────────────── */
        .nb-header__right { display:flex; align-items:center; gap:8px; }
        .nb-nav-link { font-size:12.5px; font-weight:500; letter-spacing:.05em; color:var(--text-secondary); text-decoration:none; padding:6px 12px; border-radius:4px; transition:color .2s, background .2s; white-space:nowrap; }
        .nb-nav-link:hover { color:var(--text-primary); background:rgba(255,255,255,.05); }
        .nb-icon-btn { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:50%; color:var(--text-secondary); transition:color .2s, background .2s; }
        .nb-icon-btn:hover { color:var(--text-primary); background:rgba(255,255,255,.06); }

        /* ── BURGER ────────────────────────────────────────────── */
        .nb-burger { display:flex; flex-direction:column; gap:5px; padding:6px; cursor:pointer; }
        .nb-burger span { display:block; width:22px; height:2px; background:var(--text-primary); transition:transform .3s ease, opacity .3s ease; transform-origin:center; border-radius:2px; }
        .nb-burger.open span:nth-child(1) { transform:rotate(45deg) translate(5px,5px); }
        .nb-burger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
        .nb-burger.open span:nth-child(3) { transform:rotate(-45deg) translate(5px,-5px); }

        /* ── MOBILE SEARCH BAR ─────────────────────────────────── */
        .nb-msearch { display:flex; gap:8px; padding:10px 16px 12px; border-top:1px solid rgba(255,255,255,.06); background:rgba(7,26,29,.97); }
        .nb-msearch__input { flex:1; height:40px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:6px; padding:0 14px; color:var(--text-primary); font-size:14px; font-family:var(--font-body); outline:none; }
        .nb-msearch__input:focus { border-color:var(--accent); }
        .nb-msearch__btn { padding:0 18px; height:40px; border-radius:6px; background:var(--accent); color:var(--bg-primary); font-size:12.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; cursor:pointer; border:none; white-space:nowrap; }

        /* ── CATEGORY NAV STRIP ────────────────────────────────── */
        .nb-catnav {
          position:sticky; top:64px; z-index:1000;
          background:rgba(7,26,29,.82);
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
          border-bottom:1px solid rgba(255,255,255,.06);
          transition:background .35s ease;
        }
        .nb-catnav--glass { background:rgba(7,26,29,.92); }
        .nb-catnav__track {
          display:flex; align-items:center;
          overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none;
          scroll-snap-type:x mandatory;
          padding:0 20px; height:46px; gap:0;
        }
        .nb-catnav__track::-webkit-scrollbar { display:none; }
        .nb-cat {
          flex-shrink:0; scroll-snap-align:start;
          display:flex; align-items:center;
          height:46px; padding:0 15px;
          font-size:11.5px; font-weight:600;
          letter-spacing:.1em; text-transform:uppercase;
          color:var(--text-secondary); text-decoration:none;
          position:relative; transition:color .22s; white-space:nowrap;
        }
        .nb-cat::after {
          content:''; position:absolute; bottom:0; left:15px; right:15px;
          height:2px; background:var(--accent); border-radius:2px 2px 0 0;
          transform:scaleX(0); transition:transform .25s ease;
          box-shadow:0 0 8px var(--accent);
        }
        .nb-cat:hover { color:var(--text-primary); }
        .nb-cat--active { color:var(--accent); }
        .nb-cat--active::after { transform:scaleX(1); }

        /* ── MOBILE DRAWER ─────────────────────────────────────── */
        .nb-drawer {
          position:fixed; top:0; right:0; bottom:0; width:min(320px,85vw);
          background:rgba(7,26,29,.98);
          backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
          border-left:1px solid rgba(255,255,255,.06);
          z-index:1003; transform:translateX(100%);
          transition:transform .38s cubic-bezier(.4,0,.2,1);
          overflow-y:auto;
        }
        .nb-drawer.open { transform:translateX(0); }
        .nb-drawer__inner { padding:88px 28px 100px; display:flex; flex-direction:column; gap:2px; }
        .nb-drawer__link {
          display:flex; align-items:center; gap:10px;
          font-size:1rem; font-weight:400; color:var(--text-secondary);
          text-decoration:none; padding:10px 0;
          border-bottom:1px solid rgba(255,255,255,.04);
          transition:color .2s, padding-left .2s;
        }
        .nb-drawer__link:hover { color:var(--accent); padding-left:8px; }
        .nb-drawer__link--lg { font-size:1.3rem; padding:12px 0; }
        .nb-drawer__sep { height:1px; background:rgba(255,255,255,.07); margin:14px 0; }
        .nb-drawer__label { font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--accent); padding:6px 0 4px; }

        /* ── BACKDROP ──────────────────────────────────────────── */
        .nb-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:1002; }

        /* ── RESPONSIVE SHOW/HIDE ──────────────────────────────── */
        .nb-mobile-only  { display:none; }
        .nb-desktop-only { display:flex; }

        @media(max-width:900px) {
          .nb-search       { display:none; }
          .nb-mobile-only  { display:flex; }
          .nb-desktop-only { display:none; }
          .nb-header__row  { grid-template-columns:auto auto; }
          .nb-catnav       { top:64px; }
        }
        @media(max-width:480px) {
          .nb-header__row  { height:56px; }
          .nb-catnav       { top:56px; }
          .nb-catnav__track{ height:40px; padding:0 8px; }
          .nb-cat          { font-size:11px; padding:0 11px; height:40px; }
          .nb-cat::after   { left:11px; right:11px; }
          .nb-logo         { font-size:1.45rem; }
        }
      `}</style>
    </>
  );
}
