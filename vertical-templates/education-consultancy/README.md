# Hamza Consultancy — Complete Website + Admin Panel (PHP / MySQL)

A full educational-consultancy website with a database and a complete admin panel where
**everything is editable**. Built for **Hostinger** shared hosting (PHP 8 + MySQL). No frameworks.

---

## Website pages (all content comes from the database)
- **Home** — rotating hero slider, animated stat counters, services, courses per university, partner universities, team, testimonials marquee, latest blog posts, call-to-action
- **About** — company story, mission, vision, stats, team
- **Services** — service cards
- **Courses** — all courses, filterable by university, with an Apply popup
- **Universities** — list + a detail page per university with its courses
- **Blog / News** — list + single post pages
- **Gallery** — photo grid
- **Events / Upcoming** — event listing
- **FAQ** — accordion
- **Contact** — working contact form, contact details, Google-Maps embed

Every page has a **Free Consultation popup**, a **WhatsApp** button, and a **newsletter** box.

## Working forms (saved to the database + emailed to you)
- Free Consultation popup
- "Apply" on each course
- Contact form
- Newsletter subscribe (footer)

## Admin panel — `/admin` (edit / add / update / delete everything)
- **Dashboard** — lead counts + recent enquiries + quick actions
- **Leads / Enquiries** — search, filter, mark read, delete, **export CSV**
- **Newsletter** — subscribers list + export CSV
- **Home Sliders** — add/edit banner slides (with image upload)
- **Services** — add/edit services (emoji icons)
- **Universities** — add/edit (logo upload, location, website, descriptions)
- **Courses** — add/edit (level, duration, fees, description), filter by university
- **Testimonials** — add/edit (photo, rating) + master marquee on/off
- **Team** — add/edit members (photo, socials)
- **Blog** — write/edit posts (image upload, publish/draft, preview)
- **FAQs** — add/edit questions
- **Gallery** — upload/manage photos
- **Events** — add/edit events (image, date, location)
- **Stats / Counters** — edit the animated numbers
- **Settings** — site name, contact details, socials, hero & about text, mission/vision, SEO, Google-Maps embed
- **Admin Users** — add admins, reset passwords, change your own password

Images uploaded in the admin are stored in `assets/uploads/` (JPG/PNG/WEBP/GIF/SVG, max 5 MB).

---

## Deploy to Hostinger (step by step)

### 1. Create a MySQL database
hPanel → **Databases → MySQL Databases** → create a database + user + password (give the user **All Privileges**). Note the database name, user, and password.

### 2. Edit the config
Open `public_html/inc/config.php` and fill in `DB_NAME`, `DB_USER`, `DB_PASS`.
Also set `NOTIFY_EMAIL`, `MAIL_FROM` (use a mailbox on **your** domain, created in hPanel → Emails), and change `APP_SECRET` to any long random text.

### 3. Upload the files
Upload **everything inside the `public_html` folder** into your Hostinger `public_html`
(so you get `public_html/index.php`, `public_html/admin/`, etc.). Zip → upload → extract in File Manager is easiest.

### 4. Run the installer (once)
Visit **https://yourdomain.com/install.php** → it creates all tables and loads starter content →
choose your **admin username & password** → finish → **delete `install.php`**.

### 5. Done
- Website: `https://yourdomain.com/`
- Admin: `https://yourdomain.com/admin/`

---

## Adding the real logos / images
The saved copy only kept the main logo, so placeholders are shown until you add the rest.
Use the admin panel — **Universities**, **Team**, **Sliders**, **Blog**, **Gallery** all have an
image-upload field. No need to touch code.

## Email notes
Emails use PHP `mail()`, which works on Hostinger when **MAIL_FROM** is an address on your own
domain. For best delivery, create a domain mailbox in hPanel → Emails. To switch to SMTP, drop
PHPMailer into `inc/` and swap the body of `send_mail()` in `inc/mailer.php`.

## Structure
```
public_html/        <- upload contents of this to Hostinger public_html
  *.php             <- website pages
  install.php       <- delete after setup
  inc/              <- config + core (blocked from web access via .htaccess)
  partials/         <- header, footer, consultation modal
  api/              <- submit.php (forms), newsletter.php
  admin/            <- full admin panel
  assets/           <- css, js, images, uploads
sql/schema.sql      <- reference only (installer builds everything)
```

## Verification
Built and tested end-to-end against a real MySQL database: installer, all website pages, all
admin pages, form submissions, newsletter, admin login, content creation, and image upload were
all confirmed working. All PHP files pass a syntax check.
