'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="label" style={{ display: 'block', marginBottom: '16px' }}>Say Hello</span>
          <h1 className="display-lg">Contact Us</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
            Have a question? We&apos;re here to help. Reach us via WhatsApp, call, or the form below.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        <div className="contact-grid">
          {/* Contact Info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '32px' }}>
              Get in Touch
            </h2>

            <div className="info-card">
              <div className="info-card-item">
                <span className="info-card-icon" aria-hidden="true">💬</span>
                <div className="info-card-content">
                  <h4>WhatsApp (Fastest)</h4>
                  <p>
                    <a
                      id="contact-whatsapp-link"
                      href="https://wa.me/[REPLACE_ME]?text=Hi! I'd like to inquire about your products."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#25d366' }}
                    >
                      Chat with us ↗
                    </a>
                  </p>
                </div>
              </div>
              <div className="info-card-item">
                <span className="info-card-icon" aria-hidden="true">📞</span>
                <div className="info-card-content">
                  <h4>Phone</h4>
                  <p>
                    <a id="contact-phone-link" href="tel:[REPLACE_ME]" style={{ color: 'var(--gold)' }}>
                      [REPLACE_ME — +91XXXXXXXXXX]
                    </a>
                  </p>
                </div>
              </div>
              <div className="info-card-item">
                <span className="info-card-icon" aria-hidden="true">📍</span>
                <div className="info-card-content">
                  <h4>Store Address</h4>
                  <p style={{ lineHeight: '1.6' }}>
                    [REPLACE_ME — Street Address]<br />
                    [REPLACE_ME — City, State — Pincode]
                  </p>
                </div>
              </div>
              <div className="info-card-item">
                <span className="info-card-icon" aria-hidden="true">🕐</span>
                <div className="info-card-content">
                  <h4>Store Hours</h4>
                  <p>
                    Mon–Fri: 10:00 AM – 10:00 PM<br />
                    Sat–Sun: 10:00 AM – 11:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Quick CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              <a
                id="contact-quick-whatsapp"
                href="https://wa.me/[REPLACE_ME]?text=Hi! I'd like to inquire about your products."
                target="_blank"
                rel="noopener noreferrer"
                className="store-action-btn whatsapp"
                style={{ justifyContent: 'center' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us Now
              </a>
              <a
                id="contact-quick-call"
                href="tel:[REPLACE_ME]"
                className="store-action-btn call"
                style={{ justifyContent: 'center' }}
              >
                📞 &nbsp; Call Store
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '32px' }}>
              Send a Message
            </h2>

            {status === 'success' && (
              <div className="toast success" style={{ position: 'static', marginBottom: '24px', animation: 'none' }} role="alert">
                ✅ Message received! We&apos;ll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="toast error" style={{ position: 'static', marginBottom: '24px', animation: 'none' }} role="alert">
                ❌ Something went wrong. Please try WhatsApp or phone.
              </div>
            )}

            <form id="contact-form" onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Full Name *</label>
                  <input
                    id="contact-name"
                    className="input"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email Address *</label>
                  <input
                    id="contact-email"
                    className="input"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-phone">Phone Number</label>
                  <input
                    id="contact-phone"
                    className="input"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    className="input"
                    name="message"
                    placeholder="Ask about a product, availability, or anything else…"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="btn btn-gold"
                  disabled={status === 'loading'}
                  style={{ opacity: status === 'loading' ? 0.6 : 1 }}
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  This platform is a catalog only. We do not sell or deliver alcohol directly.
                  For purchases, please visit our store or contact via phone/WhatsApp.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
