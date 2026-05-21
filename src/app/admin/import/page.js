'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

const VALID_CATEGORIES = ['Whisky', 'Wine', 'Beer', 'Rum', 'Gin', 'Vodka', 'Tequila', 'Champagne', 'Brandy', 'Liqueur'];

const COLUMN_GUIDE = [
  { col: 'name', req: true, notes: 'Product name' },
  { col: 'category', req: true, notes: `One of: ${VALID_CATEGORIES.join(', ')}` },
  { col: 'subcategory', req: false, notes: 'e.g. Single Malt, Lager' },
  { col: 'brand', req: true, notes: 'Brand name' },
  { col: 'description', req: true, notes: 'Product description' },
  { col: 'price_min', req: true, notes: 'Min price in ₹ (use same value for single price)' },
  { col: 'price_max', req: true, notes: 'Max price in ₹ (same as price_min for single price)' },
  { col: 'alcoholContent', req: true, notes: 'e.g. 40%' },
  { col: 'volume', req: true, notes: 'e.g. 750ml, 1L' },
  { col: 'origin', req: true, notes: 'e.g. Scotland, India' },
  { col: 'image', req: true, notes: 'Full image URL (https://...)' },
  { col: 'tags', req: true, notes: 'Comma-separated: scotch, premium' },
  { col: 'featured', req: true, notes: 'true or false' },
  { col: 'available', req: true, notes: 'true or false' },
];

const TAB_STYLES = (active) => ({
  padding: '10px 20px',
  borderRadius: '8px 8px 0 0',
  border: '1px solid var(--border)',
  borderBottom: active ? '1px solid var(--bg-card)' : '1px solid var(--border)',
  background: active ? 'var(--bg-card)' : 'var(--bg-secondary)',
  color: active ? 'var(--gold)' : 'var(--text-muted)',
  fontSize: '14px',
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  marginRight: '4px',
  transition: 'all 0.15s',
  position: 'relative',
  bottom: '-1px',
});

export default function BulkImportPage() {
  const [tab, setTab] = useState('upload'); // 'upload' | 'json' | 'guide'
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [preview, setPreview] = useState(null); // parsed rows before submit
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // import result
  const [error, setError] = useState('');
  const fileRef = useRef();

  const resetResult = () => { setResult(null); setError(''); };

  // --- File handling ---
  const handleFile = useCallback((file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setError('Please upload a .xlsx, .xls, or .csv file.');
      return;
    }
    setSelectedFile(file);
    setPreview(null);
    resetResult();
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  // --- Preview parse (client-side via xlsx) ---
  const handlePreview = async () => {
    if (!selectedFile) { setError('Please select a file first.'); return; }
    setError('');
    setLoading(true);
    try {
      const XLSX = await import('xlsx');
      const buf = await selectedFile.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
      setPreview(rows);
    } catch (e) {
      setError('Failed to parse file: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Submit file upload ---
  const handleFileImport = async () => {
    if (!selectedFile) { setError('No file selected.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      const res = await fetch('/api/admin/products/import', { method: 'POST', body: fd });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError('Network error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Submit JSON ---
  const handleJsonImport = async () => {
    setError('');
    setLoading(true);
    setResult(null);
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setError('Invalid JSON. Please check your syntax.');
      setLoading(false);
      return;
    }
    if (!Array.isArray(parsed)) {
      setError('JSON must be an array [ {...}, {...} ]');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError('Network error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link href="/admin/products" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>← Products</Link>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>
          📥 Bulk Import Products
        </h2>
      </div>

      {/* Stats banner if result */}
      {result && (
        <div style={{
          background: result.success ? 'rgba(92,184,92,0.08)' : 'rgba(224,84,84,0.08)',
          border: `1px solid ${result.success ? 'rgba(92,184,92,0.35)' : 'rgba(224,84,84,0.35)'}`,
          borderRadius: '10px', padding: '20px 24px', marginBottom: '24px',
          display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#5cb85c' }}>{result.inserted ?? 0}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Imported</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#e05454' }}>{result.invalidCount ?? 0}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Failed Rows</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{result.total ?? 0}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Rows</div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            {result.inserted > 0 && (
              <Link href="/admin/products" className="btn btn-gold" style={{ marginRight: '10px' }}>
                View Products →
              </Link>
            )}
            <button onClick={() => { setResult(null); setSelectedFile(null); setPreview(null); setJsonText(''); }} className="btn btn-ghost">
              Import More
            </button>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={{ background: 'rgba(224,84,84,0.1)', border: '1px solid rgba(224,84,84,0.3)', borderRadius: '8px', padding: '14px 18px', marginBottom: '20px', fontSize: '14px', color: '#e05454' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Failed rows detail */}
      {result?.errors?.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(224,84,84,0.25)', borderRadius: '10px', padding: '20px 24px', marginBottom: '24px' }}>
          <p style={{ fontWeight: 600, color: '#e05454', marginBottom: '12px', fontSize: '14px' }}>
            ❌ {result.errors.length} row(s) failed to import:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
            {result.errors.map((e, i) => (
              <div key={i} style={{ background: 'rgba(224,84,84,0.06)', borderRadius: '6px', padding: '10px 14px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Row {e.rowIndex} — {e.name}:
                </span>{' '}
                <span style={{ color: '#e05454' }}>{e.errors.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '0' }}>
        {[
          { id: 'upload', label: '📂 Upload File' },
          { id: 'json', label: '{ } Paste JSON' },
          { id: 'guide', label: '📋 Column Guide' },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={TAB_STYLES(tab === t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 8px 8px 8px', padding: '32px' }}>

        {/* === UPLOAD TAB === */}
        {tab === 'upload' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Upload Excel or CSV</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Supports .xlsx, .xls, .csv — max 10MB per file
                </p>
              </div>
              <a
                href="/api/admin/products/import"
                download="dinesh-wines-import-template.csv"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  background: 'var(--gold-muted)', color: 'var(--gold)',
                  border: '1px solid var(--border-gold)', textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
              >
                ⬇️ Download Template (.csv)
              </a>
            </div>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              style={{
                border: `2px dashed ${dragOver ? 'var(--gold)' : selectedFile ? 'rgba(92,184,92,0.6)' : 'var(--border)'}`,
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? 'var(--gold-muted)' : 'var(--bg-secondary)',
                transition: 'all 0.2s',
                marginBottom: '20px',
              }}
            >
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                {selectedFile ? '✅' : '📂'}
              </div>
              {selectedFile ? (
                <>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#5cb85c', margin: '0 0 4px' }}>{selectedFile.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB — click to change file
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>
                    Drag & drop your file here, or <span style={{ color: 'var(--gold)' }}>click to browse</span>
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    .xlsx • .xls • .csv
                  </p>
                </>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handlePreview}
                disabled={!selectedFile || loading}
                className="btn btn-ghost"
                style={{ opacity: (!selectedFile || loading) ? 0.5 : 1 }}
              >
                {loading ? 'Parsing…' : '🔍 Preview Rows'}
              </button>
              <button
                onClick={handleFileImport}
                disabled={!selectedFile || loading}
                className="btn btn-gold"
                style={{ opacity: (!selectedFile || loading) ? 0.5 : 1 }}
              >
                {loading ? 'Importing…' : '🚀 Import All'}
              </button>
            </div>

            {/* Preview Table */}
            {preview && preview.length > 0 && (
              <div style={{ marginTop: '28px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Showing preview of <strong style={{ color: 'var(--text-primary)' }}>{preview.length}</strong> rows — click "Import All" to insert into the database.
                </p>
                <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        {Object.keys(preview[0]).map((col) => (
                          <th key={col} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--gold)', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(0, 20).map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                          {Object.values(row).map((val, j) => (
                            <td key={j} style={{ padding: '9px 14px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {preview.length > 20 && (
                    <p style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', margin: 0 }}>
                      + {preview.length - 20} more rows (all will be imported)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === JSON TAB === */}
        {tab === 'json' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: 'var(--text-primary)' }}>Paste JSON Array</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Paste an array of product objects. Each object should include: <code style={{ color: 'var(--gold)', fontSize: '12px' }}>name, category, brand, description, price_min</code>
              </p>
            </div>

            {/* Example collapsible */}
            <details style={{ marginBottom: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '12px 16px', border: '1px solid var(--border)' }}>
              <summary style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--gold)', fontWeight: 600 }}>
                📌 Show JSON example
              </summary>
              <pre style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)', overflowX: 'auto', lineHeight: '1.6' }}>{`[
  {
    "name": "Glenfiddich 12 Year",
    "category": "Whisky",
    "subcategory": "Single Malt",
    "brand": "Glenfiddich",
    "description": "A classic single malt Scotch whisky.",
    "price_min": 3500,
    "price_max": 4000,
    "alcoholContent": "40%",
    "volume": "750ml",
    "origin": "Scotland",
    "image": "https://example.com/glenfiddich.jpg",
    "tags": "scotch, single malt, premium",
    "featured": false,
    "available": true
  }
]`}</pre>
            </details>

            <textarea
              id="json-input"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={'[\n  {\n    "name": "Product Name",\n    "category": "Whisky",\n    ...\n  }\n]'}
              style={{
                width: '100%', minHeight: '320px', padding: '14px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg-secondary)',
                color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'monospace',
                lineHeight: '1.6', resize: 'vertical', boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                id="json-import-btn"
                onClick={handleJsonImport}
                disabled={!jsonText.trim() || loading}
                className="btn btn-gold"
                style={{ opacity: (!jsonText.trim() || loading) ? 0.5 : 1 }}
              >
                {loading ? 'Importing…' : '🚀 Import JSON'}
              </button>
              <button onClick={() => { setJsonText(''); resetResult(); }} className="btn btn-ghost">
                Clear
              </button>
              {jsonText.trim() && (() => {
                try { const p = JSON.parse(jsonText); return Array.isArray(p) ? <span style={{ fontSize: '12px', color: '#5cb85c' }}>✓ Valid JSON — {p.length} object(s)</span> : <span style={{ fontSize: '12px', color: '#e05454' }}>⚠ Must be an array</span>; }
                catch { return <span style={{ fontSize: '12px', color: '#e05454' }}>⚠ Invalid JSON syntax</span>; }
              })()}
            </div>
          </div>
        )}

        {/* === GUIDE TAB === */}
        {tab === 'guide' && (
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: 'var(--text-primary)' }}>Column Reference Guide</h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              All columns are included in the template. Fill every column for best results. The first row of your spreadsheet must be the header row.
            </p>

            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Column Name', 'Required', 'Notes / Accepted Values'].map((h) => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--gold)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COLUMN_GUIDE.map((row, i) => (
                    <tr key={row.col} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '11px 16px', fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {row.col}
                      </td>
                      <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                          background: row.req ? 'rgba(224,84,84,0.12)' : 'rgba(180,180,180,0.1)',
                          color: row.req ? '#e05454' : 'var(--text-muted)',
                        }}>
                          {row.req ? 'Required' : 'Optional'}
                        </span>
                      </td>
                      <td style={{ padding: '11px 16px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '24px', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--border)' }}>
              <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>💡 Tips</p>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '2' }}>
                <li>For <strong style={{ color: 'var(--text-secondary)' }}>single price</strong>, set <code style={{ color: 'var(--gold)' }}>price_min</code> and <code style={{ color: 'var(--gold)' }}>price_max</code> to the same value.</li>
                <li><strong style={{ color: 'var(--text-secondary)' }}>category</strong> must exactly match (case-sensitive): <code style={{ color: 'var(--gold)' }}>{VALID_CATEGORIES.join(', ')}</code></li>
                <li><strong style={{ color: 'var(--text-secondary)' }}>tags</strong> are comma-separated in one cell: <code style={{ color: 'var(--gold)' }}>scotch, premium, aged</code></li>
                <li><strong style={{ color: 'var(--text-secondary)' }}>image</strong> should be a direct link to an image (jpg, png, webp). Leave blank if none.</li>
                <li><strong style={{ color: 'var(--text-secondary)' }}>featured / available</strong> must be exactly <code style={{ color: 'var(--gold)' }}>true</code> or <code style={{ color: 'var(--gold)' }}>false</code></li>
                <li>Each import always creates new products — duplicates are NOT automatically detected.</li>
              </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
              <a
                href="/api/admin/products/import"
                download="dinesh-wines-import-template.csv"
                className="btn btn-gold"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                ⬇️ Download CSV Template
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
