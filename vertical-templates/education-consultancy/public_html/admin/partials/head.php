<?php
require_once __DIR__ . '/../../inc/auth.php';
require_admin();
$adminTitle = $adminTitle ?? 'Admin';
$adminActive = $adminActive ?? '';
$fl = flash();
?><!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($adminTitle) ?> — <?= e(SITE_NAME) ?> Admin</title>
<link rel="icon" href="<?= e(favicon_url()) ?>">
<?php $th = themes()[setting('theme','navy')] ?? themes()['navy']; ?>
<style>
 :root{--navy:<?= $th['navy'] ?>;--navy-d:<?= $th['navy_d'] ?>;--blue:<?= $th['navy'] ?>;--blue-d:<?= $th['navy_d'] ?>;--accent:<?= $th['accent'] ?>;--accent-d:<?= $th['accent_d'] ?>;--gold-l:<?= $th['gold_l'] ?>;--line:#e5e9f1;--muted:#647694;--bg:#eef1f7}
 *{box-sizing:border-box}
 body{margin:0;font-family:'Segoe UI',system-ui,Arial,sans-serif;background:var(--bg);color:#1e2b40;-webkit-font-smoothing:antialiased}
 a{color:var(--navy);text-decoration:none}
 .layout{display:flex;min-height:100vh}
 .side{width:250px;background:linear-gradient(180deg,var(--navy),var(--navy-d));color:#c7d3e8;flex-shrink:0;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
 .side::-webkit-scrollbar{width:6px}.side::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:6px}
 .side .brand{padding:20px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;gap:10px}
 .side .brand img{height:38px;background:#fff;border-radius:8px;padding:5px}
 .side .brand b{color:#fff;font-size:15px;line-height:1.1}
 .side .brand span{display:block;font-size:10px;letter-spacing:2px;color:var(--gold-l)}
 .side nav{padding:12px 12px 20px;flex:1}
 .side nav a{display:flex;align-items:center;gap:10px;padding:11px 14px;color:#c7d3e8;border-radius:10px;font-size:14px;margin-bottom:2px;transition:.15s}
 .side nav a:hover{background:rgba(255,255,255,.08);color:#fff}
 .side nav a.active{background:var(--accent);color:#12233f;font-weight:700;box-shadow:0 6px 16px rgba(0,0,0,.2)}
 .side nav .nav-sep{padding:16px 14px 6px;font-size:10.5px;letter-spacing:1.5px;color:#8ba3c9;font-weight:700}
 .thumb-sm{height:40px;width:auto;border-radius:6px;background:#eef3fb;object-fit:cover}
 .help{font-size:12px;color:var(--muted);font-weight:normal}
 .side .logout{padding:14px 20px;border-top:1px solid rgba(255,255,255,.1);font-size:13px}
 .side .logout a{color:#ffcccc;display:inline-flex;gap:6px}
 .main{flex:1;min-width:0}
 .topbar{background:#fff;padding:16px 28px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:5}
 .topbar h1{font-size:20px;margin:0;color:var(--navy);font-weight:800}
 .topbar .tb-actions{display:flex;gap:10px;align-items:center}
 .topbar .tb-user{font-size:13px;color:var(--muted)}
 .content{padding:28px;max-width:1200px}
 .card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px;box-shadow:0 8px 26px rgba(20,50,90,.06);margin-bottom:24px}
 .card h2{color:var(--navy)}
 .grid-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin-bottom:26px}
 .stat{background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px;position:relative;overflow:hidden;box-shadow:0 8px 26px rgba(20,50,90,.06)}
 .stat::before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--grad-accent,linear-gradient(var(--accent),var(--accent-d)))}
 .stat .n{font-size:32px;font-weight:800;color:var(--navy);line-height:1}
 .stat .l{color:var(--muted);font-size:13.5px;margin-top:4px}
 table{width:100%;border-collapse:collapse;font-size:14px}
 th,td{text-align:left;padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:top}
 th{background:#f5f7fb;color:var(--navy);font-weight:700;font-size:12.5px;text-transform:uppercase;letter-spacing:.4px}
 tr:hover td{background:#fafcff}
 .btn{display:inline-flex;align-items:center;gap:6px;background:var(--navy);color:#fff;border:0;padding:10px 18px;border-radius:9px;font-size:14px;cursor:pointer;font-weight:600;transition:.15s}
 .btn:hover{background:var(--navy-d);transform:translateY(-1px)} .btn.sm{padding:6px 12px;font-size:13px;border-radius:7px}
 .btn.gray{background:#6b7688}.btn.red{background:#c0392b}.btn.green{background:#1c7a3f}
 .btn.gold{background:var(--accent);color:#12233f}
 .btn.ghost{background:#eef2f9;color:var(--navy)}
 input,select,textarea{width:100%;padding:11px 13px;border:1px solid #cfd8e6;border-radius:9px;font-size:14px;font-family:inherit;transition:.15s}
 input:focus,select:focus,textarea:focus{outline:0;border-color:var(--accent);box-shadow:0 0 0 3px rgba(201,154,63,.18)}
 textarea{min-height:90px}
 label{display:block;font-weight:600;margin:12px 0 5px;font-size:13px;color:#33445c}
 .row2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
 .flash{padding:13px 18px;border-radius:10px;margin-bottom:20px;font-size:14px;font-weight:500;border-left:4px solid}
 .flash.success{background:#e8f7ee;color:#1c7a3f;border-color:#1c7a3f}.flash.error{background:#fdeaea;color:#a12020;border-color:#c0392b}
 .pill{display:inline-block;padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600}
 .pill.on{background:#e6f6ec;color:#1c7a3f}.pill.off{background:#eef0f4;color:#889}
 .pill.consultation{background:#e7f0fb;color:#0b4a8f}.pill.application{background:#fbf0dd;color:#9c6b12}.pill.contact{background:#efe7fb;color:#5b2d91}
 .toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
 .toolbar .grow{flex:1}
 .muted{color:var(--muted)}
 .actions{display:flex;gap:6px;flex-wrap:wrap}
 /* theme picker */
 .theme-picker{display:flex;gap:16px;flex-wrap:wrap;margin-top:8px}
 .theme-opt{border:2px solid var(--line);border-radius:14px;padding:14px;cursor:pointer;width:170px;transition:.15s;position:relative}
 .theme-opt:hover{border-color:#c8d3e6}
 .theme-opt.active{border-color:var(--accent);box-shadow:0 8px 20px rgba(201,154,63,.18)}
 .theme-opt input{width:auto;position:absolute;top:12px;right:12px}
 .theme-opt .sw{display:flex;gap:6px;margin-bottom:10px}
 .theme-opt .sw i{width:34px;height:34px;border-radius:8px;display:block}
 .theme-opt .tl{font-weight:700;color:var(--navy);font-size:14px}
 @media(max-width:800px){.side{width:100%;position:static;height:auto}.layout{flex-direction:column}.row2{grid-template-columns:1fr}.content{padding:18px}}
</style></head><body>
<div class="layout">
  <aside class="side">
    <div class="brand"><img src="<?= e(favicon_url()) ?>" alt=""><div><b><?= e(setting('site_name', SITE_NAME)) ?></b><span>ADMIN</span></div></div>
    <nav>
      <a href="<?= e(url('admin/index.php')) ?>" class="<?= $adminActive==='dashboard'?'active':'' ?>">📊 Dashboard</a>
      <a href="<?= e(url('admin/submissions.php')) ?>" class="<?= $adminActive==='submissions'?'active':'' ?>">📥 Leads / Enquiries</a>
      <a href="<?= e(url('admin/newsletter.php')) ?>" class="<?= $adminActive==='newsletter'?'active':'' ?>">✉ Newsletter</a>
      <div class="nav-sep">CONTENT</div>
      <a href="<?= e(url('admin/sliders.php')) ?>" class="<?= $adminActive==='sliders'?'active':'' ?>">🖼 Home Sliders</a>
      <a href="<?= e(url('admin/services.php')) ?>" class="<?= $adminActive==='services'?'active':'' ?>">🧭 Services</a>
      <a href="<?= e(url('admin/universities.php')) ?>" class="<?= $adminActive==='universities'?'active':'' ?>">🏛 Universities</a>
      <a href="<?= e(url('admin/partners.php')) ?>" class="<?= $adminActive==='partners'?'active':'' ?>">🤝 University Partners</a>
      <a href="<?= e(url('admin/courses.php')) ?>" class="<?= $adminActive==='courses'?'active':'' ?>">📚 Courses</a>
      <a href="<?= e(url('admin/testimonials.php')) ?>" class="<?= $adminActive==='testimonials'?'active':'' ?>">⭐ Testimonials</a>
      <a href="<?= e(url('admin/team.php')) ?>" class="<?= $adminActive==='team'?'active':'' ?>">👥 Team</a>
      <a href="<?= e(url('admin/blog.php')) ?>" class="<?= $adminActive==='blog'?'active':'' ?>">📝 Blog</a>
      <a href="<?= e(url('admin/pages.php')) ?>" class="<?= $adminActive==='pages'?'active':'' ?>">📄 Pages</a>
      <a href="<?= e(url('admin/faqs.php')) ?>" class="<?= $adminActive==='faqs'?'active':'' ?>">❓ FAQs</a>
      <a href="<?= e(url('admin/gallery.php')) ?>" class="<?= $adminActive==='gallery'?'active':'' ?>">📷 Gallery</a>
      <a href="<?= e(url('admin/events.php')) ?>" class="<?= $adminActive==='events'?'active':'' ?>">📅 Events</a>
      <a href="<?= e(url('admin/stats.php')) ?>" class="<?= $adminActive==='stats'?'active':'' ?>">🔢 Stats / Counters</a>
      <div class="nav-sep">SYSTEM</div>
      <a href="<?= e(url('admin/settings.php')) ?>" class="<?= $adminActive==='settings'?'active':'' ?>">⚙ Settings</a>
      <a href="<?= e(url('admin/admins.php')) ?>" class="<?= $adminActive==='admins'?'active':'' ?>">🔑 Admin Users</a>
      <a href="<?= e(url('index.php')) ?>" target="_blank">🌐 View site &#8599;</a>
    </nav>
    <div class="logout"><a href="<?= e(url('admin/logout.php')) ?>">Log out (<?= e($_SESSION['admin_user'] ?? '') ?>)</a></div>
  </aside>
  <div class="main">
    <div class="topbar"><h1><?= e($adminTitle) ?></h1>
      <div class="tb-actions">
        <span class="tb-user">👤 <?= e($_SESSION['admin_user'] ?? '') ?></span>
        <a class="btn ghost sm" href="<?= e(url('index.php')) ?>" target="_blank">View site ↗</a>
        <a class="btn sm gray" href="<?= e(url('admin/logout.php')) ?>">Logout</a>
      </div>
    </div>
    <div class="content">
    <?php if ($fl): ?><div class="flash <?= e($fl['type']) ?>"><?= e($fl['msg']) ?></div><?php endif; ?>
