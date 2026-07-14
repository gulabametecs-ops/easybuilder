<?php
require_once __DIR__ . '/inc/content.php';
$slug = trim($_GET['slug'] ?? '');
$post = $slug ? blog_by_slug($slug) : null;
if (!$post) { http_response_code(404); $pageTitle='Not found'; include __DIR__.'/partials/header.php';
  echo '<section class="section"><div class="container-wrap"><h1 class="section-title">Post not found</h1><p class="section-sub"><a href="'.e(url('blog.php')).'">Back to blog</a></p></div></section>';
  include __DIR__.'/partials/footer.php'; exit; }

$pageTitle = $post['title'] . ' — ' . setting('site_name', SITE_NAME);
$metaDesc = $post['excerpt'] ?: excerpt($post['content']);
$activePage = 'blog';

// related posts (latest others)
$rs = db()->prepare('SELECT * FROM blog_posts WHERE is_published=1 AND id<>? ORDER BY published_at DESC, id DESC LIMIT 3');
$rs->execute([$post['id']]);
$related = $rs->fetchAll();
include __DIR__ . '/partials/header.php';
?>
<section class="page-hero"><div class="container-wrap"><h1><?= e($post['title']) ?></h1>
  <div class="crumb"><a href="<?= e(url('index.php')) ?>">Home</a> / <a href="<?= e(url('blog.php')) ?>">Blog</a></div></div></section>

<section class="section"><div class="container-wrap">
  <article class="article">
    <p class="meta" style="color:var(--muted);display:flex;gap:8px;align-items:center"><?= svg_icon('calendar') ?> <?= e(date('d M Y', strtotime($post['published_at'] ?: $post['created_at']))) ?><?= $post['author']?' · '.e($post['author']):'' ?></p>
    <?php if ($post['image']): ?>
      <img class="hero" src="<?= e(upload_url($post['image'])) ?>" alt="<?= e($post['title']) ?>">
    <?php endif; ?>
    <div class="content">
      <p style="font-size:17px;color:#26374f;font-weight:500"><?= e($post['excerpt']) ?></p>
      <?php foreach (preg_split('/\n\n+/', $post['content']) as $para): if(trim($para)==='')continue; ?>
        <p><?= nl2br(e(trim($para))) ?></p>
      <?php endforeach; ?>
    </div>

    <div style="background:#eef4fc;border-radius:16px;padding:24px;margin-top:30px;text-align:center">
      <h3 style="margin:0 0 6px;color:var(--blue)">Have questions about admissions?</h3>
      <p style="color:var(--muted);margin:0 0 14px">Get free, personalised guidance from our expert counselors.</p>
      <button class="btn btn-accent" onclick="openConsult()">Free Consultation</button>
    </div>

    <p style="margin-top:26px"><a class="btn ghost" style="background:#eef3fb;color:var(--blue)" href="<?= e(url('blog.php')) ?>">← Back to Blog</a></p>
  </article>
</div></section>

<?php if ($related): ?>
<section class="section alt"><div class="container-wrap">
  <h2 class="section-title">Related Articles</h2>
  <div class="related-grid">
    <?php foreach ($related as $p): ?>
      <a class="blog-card" href="<?= e(url('blog-single.php?slug=' . urlencode($p['slug']))) ?>">
        <div class="thumb" style="background-image:url(<?= e(upload_url($p['image'])) ?>)"></div>
        <div class="body">
          <div class="meta"><?= e(date('d M Y', strtotime($p['published_at'] ?: $p['created_at']))) ?></div>
          <h3><?= e($p['title']) ?></h3>
          <p><?= e($p['excerpt'] ?: excerpt($p['content'])) ?></p>
          <span class="more">Read more <?= svg_icon('arrow') ?></span>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</div></section>
<?php endif; ?>
<?php include __DIR__ . '/partials/footer.php'; ?>
