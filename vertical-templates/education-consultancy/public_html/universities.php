<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'Universities — ' . setting('site_name', SITE_NAME);
$activePage = 'universities';
$unis = universities();
include __DIR__ . '/partials/header.php';
?>
<section class="page-hero"><div class="container-wrap"><h1>Partner Universities</h1>
  <div class="crumb"><a href="<?= e(url('index.php')) ?>">Home</a> / Universities</div></div></section>

<section class="section"><div class="container-wrap">
  <p class="section-sub">We help you get admission to these recognized universities.</p>
  <div class="partner-grid">
    <?php foreach ($unis as $u): $count = count(courses((int)$u['id'])); ?>
      <div class="partner-card">
        <img src="<?= e(uni_logo($u['logo'])) ?>" alt="<?= e($u['name']) ?>">
        <h3><?= e($u['name']) ?></h3>
        <?php if ($u['location']): ?><p style="color:var(--accent);font-weight:600"><?= e($u['location']) ?></p><?php endif; ?>
        <p><?= e($u['short_desc']) ?></p>
        <p style="margin:12px 0"><strong><?= $count ?></strong> courses</p>
        <a class="btn sm" style="padding:8px 16px" href="<?= e(url('university.php?slug=' . urlencode($u['slug']))) ?>">View Courses</a>
      </div>
    <?php endforeach; ?>
  </div>
  <?php if (!$unis): ?><p class="section-sub">Universities will be listed here soon.</p><?php endif; ?>
</div></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
