<?php
require_once __DIR__ . '/inc/content.php';
$slug = trim($_GET['slug'] ?? '');
$page = $slug ? page_by_slug($slug) : null;
if (!$page) {
    http_response_code(404); $pageTitle = 'Not found';
    include __DIR__ . '/partials/header.php';
    echo '<section class="section"><div class="container-wrap"><h1 class="section-title">Page not found</h1><p class="section-sub"><a href="' . e(url('index.php')) . '">Back to home</a></p></div></section>';
    include __DIR__ . '/partials/footer.php'; exit;
}
$pageTitle = $page['title'] . ' — ' . setting('site_name', SITE_NAME);
$activePage = 'page-' . $page['slug'];
include __DIR__ . '/partials/header.php';
?>
<section class="band-hero"><div class="container-wrap">
  <div><h1><?= e($page['title']) ?></h1><div class="crumb"><a href="<?= e(url('index.php')) ?>">Home</a> &rsaquo; <?= e($page['title']) ?></div></div>
  <?php if (trim((string)$page['hero_subtitle']) !== ''): ?>
    <div class="bh-right"><p><?= e($page['hero_subtitle']) ?></p></div>
  <?php endif; ?>
</div></section>

<section class="section"><div class="container-wrap">
  <article class="article" style="max-width:900px;margin:0 auto" class="rich">
    <div class="content" style="color:#33445c;font-size:16px;line-height:1.75">
      <?php foreach (preg_split('/\n\n+/', (string)$page['content']) as $para): if(trim($para)==='')continue; ?>
        <p style="margin:0 0 16px"><?= nl2br(e(trim($para))) ?></p>
      <?php endforeach; ?>
    </div>
  </article>
</div></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
