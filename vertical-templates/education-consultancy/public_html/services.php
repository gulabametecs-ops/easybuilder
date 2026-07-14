<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'Services — ' . setting('site_name', SITE_NAME);
$activePage = 'services';
$wa = preg_replace('/\D/', '', setting('whatsapp'));
$img = setting('services_image', '');
include __DIR__ . '/partials/header.php';
?>
<!-- HERO -->
<section class="split-hero dark">
  <div class="sh-content">
    <span class="eyebrow">Our Services</span>
    <h1>End-to-End Support<br>for Your <span class="g">Education Journey</span></h1>
    <div class="divider"></div>
    <p>At <?= e(setting('site_name', SITE_NAME)) ?>, we provide complete admission support for Online, Distance, Regular and Part-Time programs across India's top universities.</p>
  </div>
  <div class="sh-media" <?= $img ? 'style="background-image:url(' . e(upload_url($img)) . ')"' : '' ?>>
    <?php if (!$img) echo edu_illustration(); ?>
  </div>
</section>

<!-- WHAT WE OFFER -->
<section class="section"><div class="container-wrap">
  <span class="section-eyebrow">What We Offer</span>
  <h2 class="section-title">Complete Admission Support</h2>
  <p class="section-sub">We make the admission process simple, transparent and hassle-free by offering a wide range of services under one roof.</p>
  <div class="offer-grid">
    <?php
    $offers = [
        ['headset','Career Counselling','Personalized counselling to help you choose the right course and university for your future.'],
        ['building','University Selection','Guidance in selecting UGC-approved universities that match your goals and preferences.'],
        ['clipboard','Admission Assistance','Complete support in application submission and admission procedures.'],
        ['doc','Document Verification','We help you verify and organize all required documents accurately.'],
        ['monitor','Online & Distance Programs','Wide range of UGC-approved online and distance courses from top universities.'],
        ['clock','Part-Time & Regular Courses','Options for regular, part-time and weekend programs as per your convenience.'],
        ['chart','Fee Guidance','Transparent fee structure and guidance for affordable education options.'],
        ['award','Scholarships & Loan Support','Assistance in scholarships and education loan guidance to ease your financial journey.'],
    ];
    foreach ($offers as $o): ?>
      <div class="offer-item"><div class="oic"><?= svg_icon($o[0]) ?></div>
        <div><h3><?= e($o[1]) ?></h3><p><?= e($o[2]) ?></p></div></div>
    <?php endforeach; ?>
  </div>
</div></section>

<!-- HELP BAND -->
<section class="help-band"><div class="container-wrap">
  <div class="hb-left">
    <?= edu_illustration() ?>
    <div><h2>We're Here to Help You Succeed</h2><p>From choosing the right course to admission and beyond — we are with you at every step.</p></div>
  </div>
  <div class="hb-right">
    <span class="hic"><?= svg_icon('headset') ?></span>
    <div style="flex:1"><b>Need Expert Guidance?</b><span>Talk to our education experts today.</span></div>
    <button class="btn btn-accent" onclick="openConsult()">Talk to Counsellor</button>
  </div>
</div></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
