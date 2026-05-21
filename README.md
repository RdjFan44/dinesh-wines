# Dinesh Wines 🍷

A production-ready, legally compliant **liquor catalog platform for India**. This is a catalog and store-connection layer — **not an e-commerce platform**. No cart, no checkout, no payments.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Vanilla CSS (dark luxury design) |
| Database | MongoDB Atlas |
| Deployment | Vercel |

## Quick Start

### 1. Configure MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Copy your connection string
3. Edit `.env.local`:

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/dineshwines?retryWrites=true&w=majority
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Seed the Database

Visit: **http://localhost:3000/api/seed**

This seeds 20 premium products across 8 categories + 1 store with placeholder contact details.

---

## Replace Placeholders

Search for `[REPLACE_ME]` in the codebase:

```bash
# Find all placeholders
grep -r "REPLACE_ME" src/
```

Update in:
- `src/app/api/seed/route.js` — Store name, address, phone, WhatsApp, Google Maps URL
- `src/app/contact/page.js` — WhatsApp link, phone link
- `src/app/store/page.js` — WhatsApp link (line ~30)

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, categories, featured products |
| `/products` | Product listing with filters & search |
| `/products/[id]` | Product detail with store CTAs |
| `/store` | Store info, map, contact |
| `/contact` | Contact form + quick links |
| `/legal/terms` | Terms of Service |
| `/legal/privacy` | Privacy Policy |
| `/legal/disclaimer` | Full compliance disclaimer |
| `/blocked` | Restricted state block page |

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/products` | GET | List with filters: `category`, `brand`, `minPrice`, `maxPrice`, `search`, `sort`, `page` |
| `/api/products/[id]` | GET | Single product + related |
| `/api/stores` | GET | All active stores |
| `/api/stores/[id]` | GET | Single store |
| `/api/contact` | POST | Contact inquiry |
| `/api/seed` | GET | Seed database (dev only) |

## Legal Compliance Features

✅ **Age Gate** — DOB modal (25+), blocks underage users  
✅ **Location Gate** — Blocks Gujarat, Bihar, Nagaland, Mizoram  
✅ **Platform Disclaimer** — Prominent on home + persistent in footer  
✅ **Store Responsibility** — Footer + store page  
✅ **Delivery Disclaimer** — Footer + store page  
✅ **Product Info Note** — Every product detail page  
✅ **Legal Pages** — Terms, Privacy Policy, Disclaimer  
✅ **No Cart / No Checkout / No Payments** — Catalog only

## Deploying to Vercel

1. Push to GitHub
2. Connect repo to [vercel.com](https://vercel.com)
3. Add Environment Variables in Vercel dashboard:
   - `MONGODB_URI` — your Atlas URI
   - `NEXT_PUBLIC_SITE_URL` — your Vercel URL (e.g. `https://dineshwines.vercel.app`)
4. Deploy!
5. After first deploy, visit `https://your-domain.vercel.app/api/seed` to seed the database

---

> ⚠️ This platform does not sell or deliver alcohol directly. All products are sold by licensed retailers. Compliance with local laws is the responsibility of the respective store.
