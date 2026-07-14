# Deployment Guide — StandardSaaS

This takes your platform from local dev (SQLite) to **live on the internet** with
PostgreSQL, real payments (Razorpay), image uploads, and per-client subdomains.

You'll need free accounts on: **GitHub**, **Vercel**, **Neon** (Postgres),
**Razorpay**, and a **domain** (e.g. from Namecheap/GoDaddy/Cloudflare).

---

## Overview of what changes for production

| Thing | Local (dev) | Production |
| --- | --- | --- |
| Database | SQLite (`dev.db`) | PostgreSQL (Neon) |
| Images | `public/uploads` | Vercel Blob |
| Payments | Mock (no charge) | Razorpay live/test keys |
| Domain | `*.localhost:3000` | `*.yourdomain.com` |

The code already supports all of these — it switches automatically based on
environment variables. Only **one file edit** is needed (the DB provider).

---

## Step 1 — Create a Postgres database (Neon)

1. Go to <https://neon.tech> → sign up → **Create project**.
2. Copy the **connection string** (looks like
   `postgres://user:pass@ep-xxx.aws.neon.tech/dbname?sslmode=require`).

## Step 2 — Switch the schema to Postgres

In `prisma/schema.prisma`, change the datasource provider:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
}
```

> `src/lib/db.ts` already picks the Postgres adapter automatically when
> `DATABASE_URL` starts with `postgres://` — no code change needed there.

Then, with your Neon URL set locally, create the tables:

```bash
# put the Neon URL in .env as DATABASE_URL, then:
npx prisma migrate deploy
npm run seed        # creates the super admin + demo tenants
```

## Step 3 — Get a domain & plan DNS

Buy a domain (e.g. `mysaas.com`). You need **two DNS records** (added in Step 6):

- `mysaas.com` and `www` → your app
- **`*.mysaas.com` (wildcard)** → so every client subdomain works
  (`client1.mysaas.com`, `client2.mysaas.com`, …)

> Wildcard subdomains require a **real domain** — they don't work on the free
> `*.vercel.app`. Cloudflare/Namecheap/GoDaddy all support wildcard CNAME.

## Step 4 — Razorpay keys

1. <https://dashboard.razorpay.com> → **Settings → API Keys → Generate**.
2. Copy **Key ID** and **Key Secret** (use Test keys first, then Live).

## Step 5 — Push to GitHub

```bash
git init && git add . && git commit -m "StandardSaaS"
# create a repo on github.com, then:
git remote add origin https://github.com/you/standardsaas.git
git push -u origin main
```

(Install Git first if needed: <https://git-scm.com/download/win>.)

## Step 6 — Deploy on Vercel

1. <https://vercel.com> → **Add New → Project** → import your GitHub repo.
2. **Root Directory**: set to `platform`.
3. Add **Environment Variables** (Project → Settings → Environment Variables):

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | your Neon connection string |
   | `NEXT_PUBLIC_ROOT_DOMAIN` | `mysaas.com` |
   | `AUTH_SECRET` | a long random string |
   | `RAZORPAY_KEY_ID` | your Razorpay key id |
   | `RAZORPAY_KEY_SECRET` | your Razorpay key secret |
   | `BLOB_READ_WRITE_TOKEN` | (Step 7) |

4. Click **Deploy**.

## Step 7 — Enable image uploads (Vercel Blob)

1. Vercel → your project → **Storage → Create → Blob**.
2. Copy the **`BLOB_READ_WRITE_TOKEN`** → add it as an env var → **redeploy**.

> Without this, uploads try to write to disk (read-only on Vercel) and fail.
> The code uses Blob automatically when the token is present.

## Step 8 — Connect the domain + wildcard

1. Vercel → project → **Settings → Domains** → add `mysaas.com`, `www.mysaas.com`,
   and **`*.mysaas.com`**.
2. Vercel shows the DNS records to add at your registrar:
   - `A` / `CNAME` for the apex + `www`
   - a **`CNAME *` → `cname.vercel-dns.com`** for the wildcard
3. Wait for DNS to verify (minutes to a few hours).

## Step 9 — Done ✅

- Marketing site: `https://mysaas.com`
- Super admin: `https://mysaas.com/super`  (`super@platform.test` / `super1234` —
  change this password immediately, or re-seed with your own)
- A client who subscribes gets `https://theirname.mysaas.com` + `/admin`.

---

## Testing Razorpay before going live

- Use **Test** keys. On checkout, use Razorpay's test card
  `4111 1111 1111 1111`, any future expiry, any CVV.
- Payment success → the client's site is provisioned automatically.
- Switch to **Live** keys when ready to accept real money.
- (Recommended later: add a Razorpay **webhook** for extra reliability so orders
  are confirmed even if the browser closes mid-payment.)

## Custom domains for clients (optional, later)

The `Tenant.customDomain` field already exists. To let a client use their own
`www.theirbusiness.com`: add the domain in Vercel, point their DNS to Vercel,
and set `customDomain` on their tenant row. The proxy already resolves tenants
by custom domain.

## Notes

- `npm run postinstall` runs `prisma generate` automatically on Vercel builds.
- Local dev is unchanged: SQLite + mock payments + local uploads still work with
  an empty `.env` (copy `.env.example` → `.env`).
- Keep `AUTH_SECRET` secret and unique per environment.
