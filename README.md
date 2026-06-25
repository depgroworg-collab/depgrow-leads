# Depgrow Smart Lead Capture SaaS

A production-ready multi-tenant SaaS that embeds a multi-step lead qualification form on any website, auto-scores leads as Hot / Warm / Cold, and sends instant WhatsApp alerts to the business owner.

---

## 🏗 Architecture

```
Customer's website
  └── <script src="leads.depgrow.in/embed/form.js" data-form="CUSTOMER_ID">
        │
        ├── GET  /api/form/[customerId]    ← Fetch form config + branding
        └── POST /api/submit/[customerId]  ← Save lead, score it, send WA alert

Dashboard (leads.depgrow.in/dashboard)
  ├── /dashboard           — Overview + embed code
  ├── /dashboard/leads     — CRM: filter Hot/Warm/Cold, search, CSV export
  ├── /dashboard/form      — Form builder: colors, logo, questions, thank-you
  └── /dashboard/settings  — Account + WhatsApp number
```

---

## 📁 Folder Structure

```
depgrow-leads/
├── public/embed/form.js          ← Embeddable script (vanilla JS, zero deps)
├── supabase/schema.sql           ← Complete DB schema + RLS
├── src/
│   ├── app/
│   │   ├── layout.tsx            ← Root layout
│   │   ├── page.tsx              ← Landing page
│   │   ├── globals.css           ← Tailwind + component classes
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx     ← 2-step: details → Razorpay payment
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        ← Auth guard + sidebar
│   │   │   ├── page.tsx          ← Overview + embed code
│   │   │   ├── leads/page.tsx    ← CRM table
│   │   │   ├── form/page.tsx     ← Form builder
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── form/
│   │       │   ├── [customerId]/route.ts  ← GET public form config
│   │       │   └── update/route.ts        ← PATCH form (authenticated)
│   │       ├── submit/[customerId]/route.ts ← POST lead submission
│   │       ├── leads/export/route.ts        ← GET CSV export
│   │       └── razorpay/
│   │           ├── order/route.ts   ← Create Razorpay order
│   │           └── verify/route.ts  ← Verify payment signature
│   ├── components/dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── FormBuilder.tsx       ← Live preview + all customisation
│   │   └── LeadsTable.tsx        ← Filterable, expandable, CSV export
│   ├── lib/
│   │   ├── supabase.ts           ← Browser / server / service clients
│   │   ├── scoring.ts            ← Lead scoring engine (0-100, Hot/Warm/Cold)
│   │   ├── whatsapp.ts           ← WATI + Twilio fallback
│   │   └── utils.ts              ← CSV, device detect, formatDate
│   └── types/index.ts            ← All TypeScript types + label maps
```

---

## 🎯 Lead Scoring Logic

```
Budget ≥ ₹50k  AND  Urgency = "this week"                    → 🔥 HOT
Budget ≥ ₹20k  OR   Urgency = "this month"   (and not Hot)   → 🌤 WARM
Everything else                                               → ❄️ COLD

Score (0–100) = average of budget score + urgency score
  Budget:  under_10k=5  10k_20k=20  20k_50k=40  50k_1L=70  above_1L=100
  Urgency: exploring=5  3_months=30  this_month=60  this_week=100
```

---

## 🚀 Setup

### 1. Clone & install
```bash
git clone https://github.com/yourrepo/depgrow-leads
cd depgrow-leads
npm install
```

### 2. Supabase
1. Create project at [supabase.com](https://supabase.com)
2. SQL Editor → paste `supabase/schema.sql` → Run
3. Copy URL, anon key, service role key

### 3. Razorpay
1. Create account at [razorpay.com](https://razorpay.com)
2. Settings → API Keys → Generate Key
3. Copy Key ID and Key Secret

### 4. WhatsApp (pick one)

**Option A — WATI (recommended, supports rich text)**
1. Create account at [app.wati.io](https://app.wati.io)
2. Connect your WhatsApp Business number
3. Settings → API Access → copy Bearer Token + endpoint URL

**Option B — Twilio WhatsApp (fallback)**
1. Create account at [twilio.com](https://twilio.com)
2. Enable WhatsApp Sandbox (or get approved number)
3. Copy Account SID, Auth Token, and WhatsApp sender number

### 5. Environment variables
```bash
cp .env.local.example .env.local
# Fill in all values
```

### 6. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 7. Deploy to Vercel
```bash
# Push to GitHub
# vercel.com → New Project → Import
# Add all env vars in Vercel dashboard
# Deploy ✅
# Add custom domain: leads.depgrow.in
```

---

## 📦 Embed Code

After registration, customers get their embed code in the dashboard:

```html
<!-- Floating button (default) -->
<script
  src="https://leads.depgrow.in/embed/form.js"
  data-form="CUSTOMER_ID"
  async
></script>

<!-- Inline form inside a specific div -->
<div id="my-form"></div>
<script
  src="https://leads.depgrow.in/embed/form.js"
  data-form="CUSTOMER_ID"
  data-type="inline"
  data-target="#my-form"
  async
></script>
```

Works on: **WordPress · Webflow · Wix · Shopify · React · Next.js · Plain HTML**

---

## 📲 WhatsApp Notification Format

```
🔥 New Hot Lead — Get a Free Quote

👤 Name:    Rajesh Kumar
📱 Phone:   +919876543210
📧 Email:   rajesh@company.com
💼 Service: AI Automation
💰 Budget:  ₹50,000 – ₹1,00,000
⏰ Urgency: 🔥 This week
💬 Message: Need to automate our lead follow-up

📊 Score: 85/100
📍 Source: https://clientsite.com/contact
🕐 Received: 24 Jun 2026, 3:45 PM IST

👉 View in dashboard: https://leads.depgrow.in/dashboard/leads
```

---

## 💳 Payment Flow

1. User fills in name / email / password → clicks "Continue to payment"
2. Razorpay order created server-side (`/api/razorpay/order`)
3. Razorpay checkout opens (₹14,999)
4. On success → signature verified server-side (`/api/razorpay/verify`)
5. Supabase account created → redirect to dashboard

---

## 🔒 Security

| Concern | Solution |
|---|---|
| RLS | All DB queries scoped to `auth.uid()` |
| Service role | Never exposed to browser; used only in server-side API routes |
| Payment verification | HMAC-SHA256 signature check before account creation |
| CSS conflicts | Embed script uses inline styles only |
| XSS | `textContent` used for all dynamic text in embed |
| CORS | `/api/form/*` and `/api/submit/*` open to `*`; data is non-sensitive config |

---

## 🔮 Next Steps

- [ ] Stripe / Lemon Squeezy as payment alternative
- [ ] Zapier / n8n webhook on new lead
- [ ] Email notification fallback (Resend)
- [ ] Custom domain per customer
- [ ] A/B test different form titles
- [ ] Lead reply tracking (did they get called back?)
