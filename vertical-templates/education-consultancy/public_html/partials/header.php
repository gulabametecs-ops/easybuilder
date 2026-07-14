<?php
require_once __DIR__ . '/../inc/content.php';
// Start the session BEFORE any HTML output so the CSRF cookie/token is stored
// (the consultation modal & contact form issue tokens that api/submit.php verifies).
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
$pageTitle  = $pageTitle  ?? setting('site_name', SITE_NAME);
$metaDesc   = $metaDesc   ?? setting('seo_description');
$activePage = $activePage ?? 'home';
$navUnis    = universities();
$phone      = setting('phone');
$email      = setting('email');
$wa         = preg_replace('/\D/', '', setting('whatsapp'));
$siteName   = setting('site_name', SITE_NAME);
$autoPopup  = ($autoPopup ?? false) && setting('popup_enabled', '1') === '1';
$popupDelay = (int)setting('popup_delay', '1200');

function navcls($a, $cur) { return $a === $cur ? 'active' : ''; }
?><!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($pageTitle) ?></title>
<meta name="description" content="<?= e($metaDesc) ?>">
<meta name="keywords" content="<?= e(setting('seo_keywords')) ?>">
<meta property="og:title" content="<?= e($pageTitle) ?>">
<meta property="og:description" content="<?= e($metaDesc) ?>">
<link rel="icon" href="<?= e(favicon_url()) ?>">
<link rel="apple-touch-icon" href="<?= e(favicon_url()) ?>">
<link rel="stylesheet" href="<?= e(asset('css/style.css')) ?>">
<style><?= theme_css() ?></style>
<?php if ($autoPopup): ?><script>window.HAMZA_AUTOPOPUP=1;window.HAMZA_POPUP_DELAY=<?= $popupDelay ?>;</script><?php endif; ?>
</head>
<body>

<div class="topbar"><div class="container-wrap">
  <?php if ($phone): ?><span class="tb-item"><svg viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64 0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg><a href="tel:<?= e($phone) ?>"><?= e($phone) ?></a></span><?php endif; ?>
  <?php if ($email): ?><span class="tb-item"><svg viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg><a href="mailto:<?= e($email) ?>"><?= e($email) ?></a></span><?php endif; ?>
  <?php if (setting('business_hours')): ?><span class="tb-item tb-hours"><?= e(setting('business_hours')) ?></span><?php endif; ?>
  <span class="tb-social">
    <?php foreach (['facebook','instagram','youtube','linkedin','twitter'] as $k):
      if (setting($k)): ?><a href="<?= e(setting($k)) ?>" target="_blank" rel="noopener" aria-label="<?= e($k) ?>"><?= svg_icon($k) ?></a><?php endif; endforeach; ?>
  </span>
</div></div>

<nav class="navbar"><div class="nav-inner">
  <a class="nav-logo" href="<?= e(url('index.php')) ?>"><img src="<?= e(site_logo_url()) ?>" alt="<?= e($siteName) ?>"></a>
  <div class="nav-links" id="navLinks">
    <a href="<?= e(url('index.php')) ?>" class="<?= navcls('home',$activePage) ?>">Home</a>
    <a href="<?= e(url('about.php')) ?>" class="<?= navcls('about',$activePage) ?>">About</a>
    <a href="<?= e(url('services.php')) ?>" class="<?= navcls('services',$activePage) ?>">Services</a>
    <a href="<?= e(url('courses.php')) ?>" class="<?= navcls('courses',$activePage) ?>">Courses</a>
    <a href="<?= e(url('blog.php')) ?>" class="<?= navcls('blog',$activePage) ?>">Blog</a>
    <a href="<?= e(url('events.php')) ?>" class="<?= navcls('events',$activePage) ?>">Events</a>
    <a href="<?= e(url('gallery.php')) ?>" class="<?= navcls('gallery',$activePage) ?>">Gallery</a>
    <a href="<?= e(url('contact.php')) ?>" class="<?= navcls('contact',$activePage) ?>">Contact</a>
    <?php foreach (menu_pages() as $mp): ?>
      <a href="<?= e(url('page.php?slug=' . urlencode($mp['slug']))) ?>" class="<?= ($activePage==='page-'.$mp['slug'])?'active':'' ?>"><?= e($mp['title']) ?></a>
    <?php endforeach; ?>
  </div>
  <div class="nav-right">
    <?php if ($wa): ?><a class="wa-btn" href="https://wa.me/<?= e($wa) ?>" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 448 512" fill="#25D366"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 438.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6z"/></svg></a><?php endif; ?>
    <button class="btn btn-accent" type="button" onclick="openConsult()">Apply Now</button>
    <button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button>
  </div>
</div></nav>
