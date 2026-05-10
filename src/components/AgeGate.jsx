'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const CURRENT_YEAR = new Date().getFullYear();
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

export default function AgeGate() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Start as true (blocking) until we confirm verification in sessionStorage
  const [show, setShow] = useState(true);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Skip gate on admin pages
    if (isAdmin) {
      setShow(false);
      return;
    }
    const verified = sessionStorage.getItem('ageVerified');
    if (verified === 'true') {
      setShow(false);
    } else {
      // Hard block: prevent any scrolling / interaction with background
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
    }
  }, [isAdmin]);

  const handleVerify = () => {
    setError('');
    if (!day || !month || !year) {
      setError('Please select your complete date of birth.');
      return;
    }

    const dob = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age >= 21) {
      sessionStorage.setItem('ageVerified', 'true');
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
      setShow(false);
    } else {
      // Redirect underage users away
      window.location.href = 'about:blank';
    }
  };

  const handleNo = () => {
    window.location.href = 'about:blank';
  };

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted) return null;
  // Skip gate entirely on admin pages
  if (isAdmin) return null;
  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Age Verification Required"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'var(--bg-primary)',
        backgroundImage: 'radial-gradient(circle at top right, var(--bg-secondary), var(--bg-primary) 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        // This overlay itself MUST be interactive
        pointerEvents: 'all',
      }}
    >
      {/* Decorative teal glow top-right */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0,194,199,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '52px 40px 40px',
        textAlign: 'center',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,194,199,0.05)',
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '8px',
          letterSpacing: '0.02em',
        }}>
          Dinesh<span style={{ color: 'var(--accent)' }}>.</span>
        </div>

        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '40px',
        }}>
          Est. In Excellence
        </div>

        {/* Age lock icon */}
        <div style={{ fontSize: '3rem', marginBottom: '20px', lineHeight: 1 }}>🔞</div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: '12px',
          lineHeight: 1.2,
        }}>
          Are you 21 or older?
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '36px',
        }}>
          You must be 21 years or older to enter this site.<br />
          Please verify your date of birth to continue.
        </p>

        {/* DOB Selectors */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1.5fr',
          gap: '10px',
          marginBottom: '16px',
        }}>
          <select
            id="age-gate-day"
            className="input"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            aria-label="Day of birth"
            style={{ textAlign: 'center', padding: '12px 8px' }}
          >
            <option value="">DD</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            id="age-gate-month"
            className="input"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label="Month of birth"
            style={{ textAlign: 'center', padding: '12px 8px' }}
          >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>

          <select
            id="age-gate-year"
            className="input"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            aria-label="Year of birth"
            style={{ textAlign: 'center', padding: '12px 8px' }}
          >
            <option value="">YYYY</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {error && (
          <p role="alert" style={{
            color: 'var(--red)',
            fontSize: '13px',
            marginBottom: '16px',
            padding: '10px 16px',
            background: 'rgba(224,84,84,0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(224,84,84,0.2)',
          }}>
            ⚠️ {error}
          </p>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <button
            id="age-gate-verify"
            onClick={handleVerify}
            style={{
              padding: '16px 32px',
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(0,194,199,0.2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,194,199,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,194,199,0.2)';
            }}
          >
            Yes, I am 21+ — Enter
          </button>

          <button
            id="age-gate-no"
            onClick={handleNo}
            style={{
              padding: '14px 32px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            No, I am under 21 — Exit
          </button>
        </div>

        {/* Legal text */}
        <p style={{
          marginTop: '28px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
        }}>
          By entering, you confirm you are of legal drinking age in your jurisdiction
          and agree to our Terms of Service &amp; Privacy Policy.<br /><br />
          🍷 This is a catalog only. No alcohol is sold or delivered directly.
        </p>
      </div>
    </div>
  );
}
