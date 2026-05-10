'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const RESTRICTED_STATES = ['gujarat', 'bihar', 'nagaland', 'mizoram'];

const STATE_OPTIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

function isRestricted(state) {
  const s = state.toLowerCase();
  return RESTRICTED_STATES.some((r) => s.includes(r));
}

export default function LocationGate() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [showSelector, setShowSelector] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    // Skip on admin pages
    if (isAdmin) return;
    const checked = sessionStorage.getItem('locationChecked');
    if (checked) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            const state = data?.address?.state || '';
            sessionStorage.setItem('locationChecked', 'true');
            if (isRestricted(state)) {
              router.replace('/blocked');
            }
          } catch {
            sessionStorage.setItem('locationChecked', 'true');
          }
        },
        () => {
          // User denied or unavailable — show manual selector
          setShowSelector(true);
        },
        { timeout: 8000 }
      );
    } else {
      setShowSelector(true);
    }
  }, [router]);

  const handleStateSubmit = () => {
    if (!selectedState) return;
    sessionStorage.setItem('locationChecked', 'true');
    if (isRestricted(selectedState)) {
      router.replace('/blocked');
    } else {
      setShowSelector(false);
    }
  };

  if (!showSelector) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,8,8,0.95)',
        backdropFilter: 'blur(20px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Location Verification"
    >
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div className="label" style={{ marginBottom: '24px', display: 'block' }}>
          📍 Location Check
        </div>
        <h2
          className="display-md"
          style={{ marginBottom: '12px', fontFamily: 'var(--font-display)' }}
        >
          Please select your state
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', lineHeight: '1.6' }}>
          This service is not available in certain states as per Indian regulations.
          Please select your current state to continue.
        </p>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <select
            id="location-state-select"
            className="input"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">— Select your state —</option>
            {STATE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          id="location-confirm-btn"
          className="btn btn-gold btn-full"
          onClick={handleStateSubmit}
          disabled={!selectedState}
          style={{ opacity: selectedState ? 1 : 0.5 }}
        >
          Confirm & Continue
        </button>

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px', lineHeight: '1.5' }}>
          Service unavailable in: Gujarat, Bihar, Nagaland, Mizoram
        </p>
      </div>
    </div>
  );
}
