<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'About Us — ' . setting('site_name', SITE_NAME);
$activePage = 'about';
$statList = stats();
$teamList = team();
$totalCourses = (int)db()->query('SELECT COUNT(*) FROM courses WHERE is_active=1')->fetchColumn();
$aboutImg = setting('about_image', '');
include __DIR__ . '/partials/header.php';
?>
<!-- ABOUT HERO -->
<section class="about-hero">
  <div class="about-hero-left">
    <span class="eyebrow">About Us</span>
    <h1>Guiding Aspirations.<br>Building Futures.</h1>
    <div class="divider"></div>
    <p><?= e(setting('about_short', 'Hamza Consultancy is a trusted education partner helping students achieve their academic and career goals through quality education from India\'s top universities.')) ?></p>
    <div style="margin-top:22px"><button class="btn btn-accent" onclick="openConsult()">Free Consultation</button></div>
  </div>
  <div class="about-hero-img" <?= $aboutImg ? 'style="background-image:url(' . e(upload_url($aboutImg)) . ')"' : '' ?>>
    <?php if (!$aboutImg) echo edu_illustration(); ?>
  </div>
</section>

<!-- WHO WE ARE + STATS -->
<section class="section"><div class="container-wrap wwa">
  <div>
    <span class="section-eyebrow" style="text-align:left">Who We Are</span>
    <h2 class="section-title">Your Trusted Education Partner</h2>
    <?php foreach (preg_split('/\n\n+/', setting('about_full')) as $para): if(trim($para)==='')continue; ?>
      <p><?= nl2br(e(trim($para))) ?></p>
    <?php endforeach; ?>
  </div>
  <div class="wwa-stats">
    <?php
    $ws = [
        ['building', ($statList[1]['value'] ?? '50') . ($statList[1]['suffix'] ?? '+'), 'University Partners'],
        ['book',     $totalCourses . '+', 'Courses Available'],
        ['users',    ($statList[0]['value'] ?? '10000') . ($statList[0]['suffix'] ?? '+'), 'Successful Admissions'],
        ['shield',   '100%', 'Support & Guidance'],
    ];
    foreach ($ws as $w): ?>
      <div class="wwa-stat"><div class="wic"><?= svg_icon($w[0]) ?></div><div class="n"><?= e($w[1]) ?></div><div class="l"><?= e($w[2]) ?></div></div>
    <?php endforeach; ?>
  </div>
</div></section>

<!-- MISSION / VISION / PROMISE -->
<section class="section alt"><div class="container-wrap mvp">
  <div class="mvp-img"><?= edu_illustration() ?></div>
  <div class="mvp-col">
    <span class="eyebrow">Our Mission</span><div class="barline"></div>
    <p><?= e(setting('mission')) ?></p>
  </div>
  <div class="mvp-col">
    <span class="eyebrow">Our Vision</span><div class="barline"></div>
    <p><?= e(setting('vision')) ?></p>
  </div>
  <div class="mvp-col">
    <span class="eyebrow">Our Promise</span><div class="barline"></div>
    <ul>
      <li><?= svg_icon('check') ?> Trusted &amp; Genuine Guidance</li>
      <li><?= svg_icon('check') ?> Wide Range of Programs</li>
      <li><?= svg_icon('check') ?> Affordable Education Solutions</li>
      <li><?= svg_icon('check') ?> End-to-End Admission Support</li>
    </ul>
  </div>
</div></section>

<!-- OUR VALUES -->
<section class="section"><div class="container-wrap">
  <span class="section-eyebrow">Our Values</span>
  <h2 class="section-title">What We Stand For</h2>
  <div class="values-row">
    <?php
    $vals = [
        ['star','Student First','We put students\' goals and success above all.'],
        ['handshake','Integrity','We believe in honesty, transparency and trust.'],
        ['target','Excellence','We are committed to quality and excellence.'],
        ['bulb','Innovation','We embrace new ideas and technology.'],
        ['headset','Support','We are with you at every step.'],
    ];
    foreach ($vals as $v): ?>
      <div class="value-item"><div class="vic"><?= svg_icon($v[0]) ?></div><h3><?= e($v[1]) ?></h3><p><?= e($v[2]) ?></p></div>
    <?php endforeach; ?>
  </div>
</div></section>

<?php if ($teamList): ?>
<section class="section alt"><div class="container-wrap">
  <span class="section-eyebrow">Our People</span>
  <h2 class="section-title">Meet Our Team</h2>
  <div class="team-grid">
    <?php foreach ($teamList as $m): ?>
      <div class="team-card">
        <img src="<?= e(upload_url($m['photo'])) ?>" alt="<?= e($m['name']) ?>">
        <h3><?= e($m['name']) ?></h3><div class="role"><?= e($m['position']) ?></div><p><?= e($m['bio']) ?></p>
      </div>
    <?php endforeach; ?>
  </div>
</div></section>
<?php endif; ?>

<section class="cta-band"><h2>Ready to Begin Your Journey?</h2><p>Book a free consultation with our expert counsellors today.</p>
  <button class="btn btn-accent" onclick="openConsult()">Book Free Counselling</button></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
