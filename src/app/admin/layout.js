'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '🍾' },
  { href: '/admin/products/add', label: 'Add Product', icon: '➕' },
  { href: '/admin/import', label: 'Bulk Import', icon: '📥' },
  { href: '/', label: 'View Site ↗', icon: '🌐' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-240px',
        bottom: 0,
        zIndex: 200,
        transition: 'left 0.3s ease',
      }}
      id="admin-sidebar"
      >
        {/* Brand */}
        <div style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600 }}>
            Dinesh <span style={{ color: 'var(--gold)' }}>Wines</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '4px' }}>
            Admin Panel
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {adminNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--gold-muted)' : 'transparent',
                  border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                  marginBottom: '4px',
                  transition: 'var(--transition)',
                  textDecoration: 'none',
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '11px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              color: '#e05454',
              background: 'transparent',
              border: '1px solid rgba(224,84,84,0.2)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              opacity: loggingOut ? 0.5 : 1,
            }}
          >
            🚪 {loggingOut ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Desktop sidebar spacer */}
      <div style={{ width: '240px', flexShrink: 0 }} className="admin-sidebar-spacer" />

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{
          height: '60px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: 'var(--bg-secondary)',
          gap: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px',
            }}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
            {adminNavLinks.find((l) => l.href === pathname)?.label || 'Admin'}
          </h1>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Dinesh Wines Admin
          </span>
        </div>

        <div style={{ padding: '32px', flex: 1 }}>
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 199,
          }}
        />
      )}

      <style>{`
        @media (min-width: 768px) {
          #admin-sidebar { left: 0 !important; }
          .admin-sidebar-spacer { display: block; }
        }
        @media (max-width: 767px) {
          .admin-sidebar-spacer { display: none; }
        }
      `}</style>
    </div>
  );
}
