# Deployment Guide — SitePixl

This takes your platform from local dev to **live on the internet** with
MySQL, real payments (Razorpay), image uploads, and per-client subdomains.

You'll need: **GitHub**, **Vercel** (or any Node host), a **MySQL 8** database
(e.g. Aiven, PlanetScale-compatible, DigitalOcean, AWS RDS, or your own server),
**Razorpay**, and a **domain** (e.g. from Namecheap/GoDaddy/Cloudflare).

---

## Overview of what changes for production

| Thing | Local (dev) | Production |
| --- | --- | --- |
| Database | MySQL on your PC (`127.0.0.1:3306`) | Hosted MySQL 8 |
| Images | `public/uploads` | Vercel Blob |
| Payments | Mock (no charge) | Razorpay live/test keys |
| Domain | `*.localhost:3000` | `*.yourdomain.com` |

The code switches automatically based on environment variables — no code edits.

---

## Step 1 — Local MySQL (development)

1. Install MySQL Server 8 (already done on this PC) and note the root password.
2. In `.env` set (URL-encode special characters in the password: `@`→`%40`, `#`→`%23`):

   ```
   DATABASE_URL="mysql://root:YOUR_PASSWORD@127.0.0.1:3306/standardsaas"
   ```
3. Create the database, tables and the 40 demo sites:

   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS standardsaas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
   npm run db:setup      # = prisma migrate deploy + seed
   ```
   Local logins: super admin `super@platform.test` / `super1234`, demo admins `demo@<sector>.test` / `demo1234`.

## Step 2 — Production MySQL

1. Create a MySQL 8 database (utf8mb4) at your provider and copy its connection
   string: `mysql://USER:PASSWORD@HOST:3306/DBNAME`.
2. With that URL as `DATABASE_URL`, create the tables and seed:

   ```bash
   npx prisma migrate deploy
   # seed requires your own super-admin login outside localhost:
   SUPER_ADMIN_EMAIL="you@yourdomain.com" SUPER_ADMIN_PASSWORD="a-long-password" npm run seed
   # (demo tenants get a random owner password in production — visitors use the demo OTP flow)
   ```

> **Changing the schema later:** edit `prisma/schema.prisma`, then run
> `npm run db:new-migration -- <name>`. It diffs the schema against
> `prisma/migrations/schema.snapshot.prisma` (not the live DB, which MySQL makes look
> different), writes the migration, rewrites TEXT defaults into the `DEFAULT ('…')` form
> MySQL 8 accepts, applies it with `migrate deploy`, and updates the snapshot.
> Don't use `prisma migrate dev` here. Long text fields use `@db.MediumText`; ids/keys stay plain `String`.

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
git init && git add . && git commit -m "SitePixl"
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
   | `DATABASE_URL` | your MySQL connection string (`mysql://…`) |
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
- Super admin: `https://mysaas.com/super`  (the `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` you seeded with)
- A client who subscribes gets `https://theirname.mysaas.com` + `/admin`.

### Required production secrets

| Name | Why |
| --- | --- |
| `AUTH_SECRET` | Signs session JWTs — never leave the default |
| `CRON_SECRET` | Protects `/api/cron/renewal-reminders` |
| `RAZORPAY_WEBHOOK_SECRET` | Optional but recommended — webhook at `/api/webhooks/razorpay` |

Configure the Razorpay webhook URL to `https://mysaas.com/api/webhooks/razorpay`
(events: `payment.captured`, `order.paid`) so orders still provision if the
browser closes mid-checkout.

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
- Local dev needs a running MySQL (see Step 1); payments are mocked and uploads go to
  `public/uploads` while their keys are empty (copy `.env.example` → `.env`).
- Keep `AUTH_SECRET` secret and unique per environment.
