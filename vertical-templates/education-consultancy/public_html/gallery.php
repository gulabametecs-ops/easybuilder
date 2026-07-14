<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'Gallery — ' . setting('site_name', SITE_NAME);
$activePage = 'gallery';
$all = gallery();
$cats = [];
foreach ($all as $g) { $c = trim($g['category']); if ($c !== '' && !in_array($c, $cats)) $cats[] = $c; }
$active = trim($_GET['g'] ?? '');
$items = $active !== '' ? array_values(array_filter($all, fn($g)=>trim($g['category'])===$active)) : $all;
include __DIR__ . '/partials/header.php';
?>
<section class="band-hero"><div class="container-wrap">
  <div><h1>Gallery</h1><div class="crumb"><a href="<?= e(url('index.php')) ?>">Home</a> &rsaquo; Gallery</div></div>
  <div class="bh-right"><h3>Moments that inspire, events that connect.</h3><p>Explore glimpses of our events, seminars, university visits, student interactions and success celebrations.</p></div>
</div></section>

<section class="section"><div class="container-wrap">
  <?php if ($cats): ?>
  <div class="gallery-tabs">
    <a href="<?= e(url('gallery.php')) ?>" class="<?= $active===''?'active':'' ?>">All</a>
    <?php foreach ($cats as $c): ?>
      <a href="<?= e(url('gallery.php?g=' . urlencode($c))) ?>" class="<?= $active===$c?'active':'' ?>"><?= e($c) ?></a>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <?php if ($items): ?>
  <div class="gallery-grid2">
    <?php foreach ($items as $g): ?>
      <div class="gcard">
        <a href="<?= e(upload_url($g['image'])) ?>" target="_blank" title="<?= e($g['title']) ?>"><img src="<?= e(upload_url($g['image'])) ?>" alt="<?= e($g['title']) ?>" loading="lazy"></a>
        <?php if ($g['title']): ?><div class="cap"><?= e($g['title']) ?></div><?php endif; ?>
      </div>
    <?php endforeach; ?>
  </div>
  <?php else: ?><p class="section-sub">Photos will be added here soon.</p><?php endif; ?>
</div></section>

<section class="help-band"><div class="container-wrap" style="grid-template-columns:1.4fr auto">
  <div class="hb-left" style="border:0;padding:0">
    <span class="illus" style="width:60px"><?= svg_icon('star') ?></span>
    <div><h2>Want to be a part of our next event?</h2><p>Stay connected with us for the latest updates and exciting opportunities.</p></div>
  </div>
  <button class="btn btn-accent" onclick="openConsult()">Stay Connected</button>
</div></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
