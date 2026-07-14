<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'FAQ — ' . setting('site_name', SITE_NAME);
$activePage = 'faq';
$q = trim($_GET['q'] ?? '');
$items = faqs();
if ($q !== '') {
    $items = array_values(array_filter($items, function ($f) use ($q) {
        return stripos($f['question'], $q) !== false || stripos($f['answer'], $q) !== false;
    }));
}
include __DIR__ . '/partials/header.php';
?>
<section class="page-hero"><div class="container-wrap"><h1>Frequently Asked Questions</h1>
  <div class="crumb"><a href="<?= e(url('index.php')) ?>">Home</a> / FAQ</div></div></section>

<section class="section"><div class="container-wrap">
  <p class="section-sub">Everything you need to know about our services, courses, recognition, fees and the admission process. Can't find your answer? Just ask our team.</p>

  <form class="search-bar" method="get" action="<?= e(url('faq.php')) ?>">
    <span class="search-ic"><?= svg_icon('search') ?></span>
    <input type="text" name="q" value="<?= e($q) ?>" placeholder="Search questions…">
    <button type="submit">Search</button>
  </form>

  <div class="faq-list">
    <?php foreach ($items as $i => $f): ?>
      <div class="faq-item <?= $i===0?'open':'' ?>"><div class="faq-q"><?= e($f['question']) ?></div><div class="faq-a"><p><?= nl2br(e($f['answer'])) ?></p></div></div>
    <?php endforeach; ?>
    <?php if (!$items): ?><p class="section-sub">No questions matched<?= $q!==''?' “'.e($q).'”':'' ?>. <a href="<?= e(url('faq.php')) ?>">View all FAQs</a></p><?php endif; ?>
  </div>

  <div style="max-width:820px;margin:34px auto 0;background:#eef4fc;border-radius:18px;padding:30px;text-align:center">
    <h3 style="margin:0 0 6px;color:var(--blue)">Still have a question?</h3>
    <p class="muted" style="margin:0 0 16px">Our counselors are happy to help — free of charge.</p>
    <button class="btn btn-accent" onclick="openConsult()">Ask Our Team</button>
    <?php $wa = preg_replace('/\D/','',setting('whatsapp')); if ($wa): ?>
      <a class="btn" style="margin-left:8px;background:#25D366" href="https://wa.me/<?= e($wa) ?>" target="_blank" rel="noopener">WhatsApp Us</a>
    <?php endif; ?>
  </div>
</div></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
