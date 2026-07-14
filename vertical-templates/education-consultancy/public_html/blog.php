<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'Blog & News — ' . setting('site_name', SITE_NAME);
$activePage = 'blog';

$q = trim($_GET['q'] ?? '');
if ($q !== '') {
    $st = db()->prepare('SELECT * FROM blog_posts WHERE is_published=1 AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?) ORDER BY published_at DESC, id DESC');
    $st->execute(["%$q%","%$q%","%$q%"]); $posts = $st->fetchAll();
} else { $posts = blog_posts(); }

function blog_cat(string $t): string {
    $t = strtolower($t);
    foreach (['university'=>'Universities','online'=>'Online Learning','distance'=>'Distance Education',
        'admission'=>'Admission Guide','document'=>'Admission Guide','scholarship'=>'Scholarships',
        'career'=>'Career Tips','language'=>'Career Tips'] as $k=>$v) if (strpos($t,$k)!==false) return $v;
    return 'Education News';
}
function read_time(string $c): int { return max(1, (int)ceil(str_word_count(strip_tags($c))/200)); }

// sidebar categories with counts
$catDefs = ['Universities','Online Learning','Distance Education','Admission Guide','Scholarships','Career Tips','Education News'];
$catCounts = array_fill_keys($catDefs, 0);
foreach (blog_posts() as $p) { $c = blog_cat($p['title']); $catCounts[$c] = ($catCounts[$c] ?? 0) + 1; }
include __DIR__ . '/partials/header.php';
?>
<section class="band-hero"><div class="container-wrap">
  <div><h1>Blog &amp; News</h1><div class="crumb"><a href="<?= e(url('index.php')) ?>">Home</a> &rsaquo; Blog &amp; News</div></div>
  <div class="bh-right"><h3>Stay Informed. Stay Ahead.</h3><p>Latest updates on education, universities, exams, career tips and industry insights.</p></div>
</div></section>

<section class="section"><div class="container-wrap blog-layout">
  <div class="blog-main">
    <?php if ($q!==''): ?><p class="section-sub" style="text-align:left;margin:0 0 20px"><?= count($posts) ?> result(s) for &ldquo;<?= e($q) ?>&rdquo; · <a href="<?= e(url('blog.php')) ?>">clear</a></p><?php endif; ?>
    <?php if ($posts): ?>
    <div class="blog-grid">
      <?php foreach ($posts as $p): ?>
        <a class="blog-card" href="<?= e(url('blog-single.php?slug=' . urlencode($p['slug']))) ?>">
          <div class="thumb" style="background-image:url(<?= e(upload_url($p['image'])) ?>)"></div>
          <div class="body">
            <span class="cat"><?= e(blog_cat($p['title'])) ?></span>
            <h3><?= e($p['title']) ?></h3>
            <p><?= e($p['excerpt'] ?: excerpt($p['content'])) ?></p>
            <div class="metabar">
              <span><?= svg_icon('calendar') ?> <?= e(date('M d, Y', strtotime($p['published_at'] ?: $p['created_at']))) ?></span>
              <span><?= svg_icon('users') ?> By <?= e($p['author'] ?: 'Admin') ?></span>
              <span><?= svg_icon('clock') ?> <?= read_time($p['content']) ?> min read</span>
            </div>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
    <?php else: ?><p class="section-sub">No articles found. <a href="<?= e(url('blog.php')) ?>">View all</a></p><?php endif; ?>
  </div>

  <aside class="blog-sidebar">
    <form class="side-search" method="get" action="<?= e(url('blog.php')) ?>">
      <input type="text" name="q" value="<?= e($q) ?>" placeholder="Search blogs...">
      <button type="submit"><?= svg_icon('search') ?></button>
    </form>
    <div class="side-widget">
      <h4>Categories</h4>
      <div class="cat-list">
        <?php foreach ($catDefs as $c): if(($catCounts[$c]??0)===0)continue; ?>
          <a href="<?= e(url('blog.php?q=' . urlencode($c))) ?>"><?= e($c) ?> <span class="cnt2">(<?= (int)$catCounts[$c] ?>)</span></a>
        <?php endforeach; ?>
      </div>
    </div>
    <div class="side-widget subscribe">
      <h4>Stay Updated</h4>
      <p class="muted" style="font-size:13px;margin-top:0">Subscribe to our newsletter and get the latest education updates.</p>
      <form onsubmit="return subscribeNews(event)">
        <input type="email" name="email" placeholder="Enter your email address" required>
        <button type="submit">Subscribe Now</button>
      </form>
      <div class="news-msg" id="newsMsg" style="font-size:12px;margin-top:8px"></div>
    </div>
  </aside>
</div></section>

<section class="cta-band"><h2>Need Expert Guidance for Your Education Journey?</h2>
  <p>Our counsellors are here to help you choose the right course and university.</p>
  <button class="btn btn-accent" onclick="openConsult()">Book Free Counselling</button></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
