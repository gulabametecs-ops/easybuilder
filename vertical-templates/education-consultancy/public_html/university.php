<?php
require_once __DIR__ . '/inc/content.php';
$slug = trim($_GET['slug'] ?? '');
$uni = $slug ? university_by_slug($slug) : null;
if (!$uni) { http_response_code(404); $pageTitle = 'Not found'; include __DIR__ . '/partials/header.php';
  echo '<section class="section"><div class="container-wrap"><h1 class="section-title">University not found</h1><p class="section-sub"><a href="'.e(url('universities.php')).'">Back to universities</a></p></div></section>';
  include __DIR__ . '/partials/footer.php'; exit; }

$pageTitle = $uni['name'] . ' — ' . setting('site_name', SITE_NAME);
$activePage = 'universities';
$list = courses((int)$uni['id']);
include __DIR__ . '/partials/header.php';
?>
<section class="page-hero"><div class="container-wrap"><h1><?= e($uni['name']) ?></h1>
  <div class="crumb"><a href="<?= e(url('index.php')) ?>">Home</a> / <a href="<?= e(url('universities.php')) ?>">Universities</a> / <?= e($uni['name']) ?></div></div></section>

<section class="section"><div class="container-wrap">
  <div class="uni-head">
    <img src="<?= e(uni_logo($uni['logo'])) ?>" alt="<?= e($uni['name']) ?>">
    <div>
      <h2 style="margin:0 0 6px;color:var(--blue)"><?= e($uni['name']) ?></h2>
      <?php if ($uni['location']): ?><p style="margin:0;color:var(--muted)">📍 <?= e($uni['location']) ?></p><?php endif; ?>
      <?php if ($uni['website']): ?><p style="margin:6px 0 0"><a href="<?= e($uni['website']) ?>" target="_blank" rel="noopener">Official website ↗</a></p><?php endif; ?>
    </div>
  </div>
  <?php if (trim((string)$uni['description']) !== ''): ?>
    <p style="margin-top:18px;color:var(--muted)"><?= nl2br(e($uni['description'])) ?></p>
  <?php elseif ($uni['short_desc']): ?>
    <p style="margin-top:18px;color:var(--muted)"><?= e($uni['short_desc']) ?></p>
  <?php endif; ?>

  <h3 style="margin-top:34px;color:var(--blue)">Available Courses (<?= count($list) ?>)</h3>
  <div class="xcard-grid" style="margin-top:16px">
    <?php foreach ($list as $c) echo course_card_html($c['title'], $uni['name'], $c['level'] ?? '', $c['duration'] ?? ''); ?>
  </div>
  <?php if (!$list): ?><p class="section-sub">Courses will be added soon.</p><?php endif; ?>
</div></section>

<section class="cta-band"><h2>Interested in <?= e($uni['name']) ?>?</h2><p>Get free guidance on admission and the right course for you.</p>
  <button class="btn btn-accent" onclick="openConsult()">Free Consultation</button></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
