// ── STATE ──
let products = [];
let currentFilter = "all";
let currentSlide = 0;

// ── CATEGORY NORMALIZER ──
// DB stores "Whisky", "Beer", etc. — frontend filters on lowercase
// Also maps DB categories to the frontend's category keys
function normalizeCategory(cat) {
  const map = {
    'whisky': 'whiskey',
    'whiskey': 'whiskey',
    'wine': 'wine',
    'beer': 'beer',
    'rum': 'rum',
    'gin': 'gin',
    'vodka': 'vodka',
    'tequila': 'tequila',
    'champagne': 'champagne',
    'brandy': 'brandy',
    'liqueur': 'rtd',
    'rtd': 'rtd',
  };
  return map[(cat || '').toLowerCase()] || (cat || '').toLowerCase();
}

// ── CATEGORY IMAGE FALLBACK ──
function categoryImage(cat) {
  const map = {
    whiskey: 'Category Image Whiskey.png',
    beer: 'Category Image Beer.png',
    wine: 'Category Image Wine.png',
    vodka: 'Category Image Vodka.png',
    gin: 'Category Image Gin.png',
    rum: 'Category Image Rum.png',
    tequila: 'Category Image Tequila.png',
    champagne: 'Category Image Champagne.png',
    brandy: 'Category Image Brandy.png',
    rtd: 'Category Image RTD.png',
  };
  return map[cat] || 'Front Main Image.png';
}

// ── LOAD PRODUCTS FROM API ──
async function loadProducts() {
  try {
    const res = await fetch('/api/products?limit=200');
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      products = data.data.map(p => {
        const cat = normalizeCategory(p.category);
        return {
          id: p._id,
          name: p.name,
          brand: p.brand,
          cat: cat,
          // Use the product's own image; fall back to a matching category image
          img: p.image && !p.image.startsWith('http') === false && p.image
            ? p.image
            : categoryImage(cat),
          vol: p.volume || '750ml',
          abv: p.alcoholContent || 'N/A',
          origin: p.origin || 'India',
          type: p.subcategory || p.category,
          desc: p.description || '',
        };
      });
    }
  } catch (e) {
    console.error('[Dinesh Wines] Failed to load products from API:', e);
  }

  // If the API returned nothing (empty DB / dev mode), show a helpful message
  renderCatalog('all');
}

// ══ AGE + LOCATION VERIFICATION ══
function verifyAge() {
  const state = document.getElementById("state-select").value;
  const d = parseInt(document.getElementById("dob-day").value);
  const m = parseInt(document.getElementById("dob-month").value);
  const y = parseInt(document.getElementById("dob-year").value);
  const chkAge = document.getElementById("chk-age").checked;
  const chkMH = document.getElementById("chk-mh").checked;
  const chkTerms = document.getElementById("chk-terms").checked;

  // State check
  if (!state) {
    showModalError("Please select your state of residence.");
    return;
  }
  if (state !== "maharashtra") {
    showModalError("Sorry, this catalog is only accessible to residents of Maharashtra.");
    return;
  }

  // DOB check
  if (!d || !m || !y || isNaN(d) || isNaN(m) || isNaN(y)) {
    showModalError("Please enter a valid date of birth.");
    return;
  }
  if (y < 1900 || y > new Date().getFullYear()) {
    showModalError("Please enter a valid birth year.");
    return;
  }

  const birth = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const mo = today.getMonth() - birth.getMonth();
  if (mo < 0 || (mo === 0 && today.getDate() < birth.getDate())) age--;

  if (age < 21) {
    showModalError("Access denied. You must be 21 years or older to view this catalog.");
    return;
  }

  // Checkboxes
  if (!chkAge) {
    showModalError("Please confirm that you are 21 years of age or older.");
    return;
  }
  if (!chkMH) {
    showModalError("Please confirm that you are a resident of Maharashtra.");
    return;
  }
  if (!chkTerms) {
    showModalError("Please agree to the Terms of Use to continue.");
    return;
  }

  // All passed
  document.getElementById("age-modal").style.display = "none";
  sessionStorage.setItem("dw_verified", "1");
}

function showModalError(msg) {
  let el = document.getElementById("modal-error");
  if (!el) {
    el = document.createElement("p");
    el.id = "modal-error";
    el.style.cssText = "color:#ff6b6b;font-size:0.8rem;margin:10px 0 0;font-weight:600;text-align:center;";
    document.querySelector(".btn-verify").before(el);
  }
  el.textContent = "⚠ " + msg;
}

// ══ HERO SLIDER ══
function goSlide(n) {
  document.querySelectorAll(".hero-slide").forEach((s, i) => s.classList.toggle("active", i === n));
  document.querySelectorAll(".hero-dot").forEach((d, i) => d.classList.toggle("active", i === n));
  currentSlide = n;
}
setInterval(() => goSlide((currentSlide + 1) % 3), 5500);



// ══ RENDER CATALOG ══
function renderCatalog(filter) {
  currentFilter = filter;
  const list = filter === "all" ? products : products.filter(p => p.cat === filter);
  const grid = document.getElementById("products-grid");
  const countEl = document.getElementById("catalog-count");

  if (!grid) return;

  if (products.length === 0) {
    countEl.textContent = "No products listed yet";
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:64px 24px;color:var(--gray-400);">
      <div style="font-size:3rem;margin-bottom:16px;">🍾</div>
      <p style="font-size:1rem;margin-bottom:6px;color:var(--gray-200);">Products Coming Soon</p>
      <p style="font-size:0.82rem;">Visit our licensed store to explore our full collection.</p>
    </div>`;
    return;
  }

  countEl.textContent = `Showing ${list.length} product${list.length !== 1 ? "s" : ""}${filter !== "all" ? " in " + filter.charAt(0).toUpperCase() + filter.slice(1) : ""}`;

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--gray-400);">
      <div style="font-size:2.5rem;margin-bottom:12px;">🔍</div>
      <p>No products found in this category.</p>
    </div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="product-card catalog-card">
      <div class="catalog-cat-badge">${p.cat.charAt(0).toUpperCase() + p.cat.slice(1)}</div>
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='${categoryImage(p.cat)}'"/>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-meta-row">
          <span class="meta-chip"><i class="fa fa-wine-bottle"></i> ${p.vol}</span>
          <span class="meta-chip"><i class="fa fa-percent"></i> ${p.abv} ABV</span>
          <span class="meta-chip"><i class="fa fa-globe"></i> ${p.origin}</span>
        </div>
        <div class="product-type">${p.type}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="in-store-note"><i class="fa fa-store"></i> Available in-store only</div>
      </div>
    </div>
  `).join("");
}

// ══ FILTER TABS ══
function setTab(el, filter) {
  document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
  if (el) el.classList.add("active");
  renderCatalog(filter);
}

function navFilter(el, cat) {
  // Sync nav link active state
  document.querySelectorAll(".cat-link").forEach(l => l.classList.remove("active"));
  // Sync filter tab
  document.querySelectorAll(".filter-tab").forEach(t => {
    t.classList.remove("active");
    if (t.textContent.trim().toLowerCase() === cat || (cat === "all" && t.textContent.trim() === "All")) t.classList.add("active");
  });
  renderCatalog(cat);
  document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
}

// ══ SEARCH ══
function doSearch() {
  const q = document.getElementById("search-input").value.trim().toLowerCase();
  const cat = document.getElementById("search-cat-select").value;
  let list = products;
  if (cat) list = list.filter(p => p.cat === cat);
  if (q) list = list.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.type.toLowerCase().includes(q) ||
    p.origin.toLowerCase().includes(q)
  );

  const grid = document.getElementById("products-grid");
  const countEl = document.getElementById("catalog-count");
  document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    countEl.textContent = `Found ${list.length} result${list.length !== 1 ? "s" : ""} for "${q || cat}"`;
    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--gray-400);">
        <div style="font-size:2.5rem;margin-bottom:12px;">🔍</div>
        <p>No products found matching your search.</p>
      </div>`;
    } else {
      grid.innerHTML = list.map(p => `
        <div class="product-card catalog-card">
          <div class="catalog-cat-badge">${p.cat.charAt(0).toUpperCase() + p.cat.slice(1)}</div>
          <div class="product-img-wrap"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='${categoryImage(p.cat)}'"/></div>
          <div class="product-info">
            <div class="product-brand">${p.brand}</div>
            <div class="product-name">${p.name}</div>
            <div class="product-meta-row">
              <span class="meta-chip"><i class="fa fa-wine-bottle"></i> ${p.vol}</span>
              <span class="meta-chip"><i class="fa fa-percent"></i> ${p.abv} ABV</span>
              <span class="meta-chip"><i class="fa fa-globe"></i> ${p.origin}</span>
            </div>
            <div class="product-type">${p.type}</div>
            <div class="product-desc">${p.desc}</div>
            <div class="in-store-note"><i class="fa fa-store"></i> Available in-store only</div>
          </div>
        </div>
      `).join("");
    }
  }, 400);
}

document.getElementById("search-input").addEventListener("keydown", e => {
  if (e.key === "Enter") doSearch();
});

// ══ INIT ══
if (sessionStorage.getItem("dw_verified")) {
  document.getElementById("age-modal").style.display = "none";
}
// Load products from the Next.js API
loadProducts();
