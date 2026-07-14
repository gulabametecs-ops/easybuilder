<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'Terms & Conditions — ' . setting('site_name', SITE_NAME);
$activePage = '';
$site = setting('site_name', SITE_NAME);
include __DIR__ . '/partials/header.php';
?>
<section class="page-hero"><div class="container-wrap"><h1>Terms &amp; Conditions</h1>
  <div class="crumb"><a href="<?= e(url('index.php')) ?>">Home</a> / Terms</div></div></section>

<section class="section"><div class="container-wrap"><div class="article" style="color:#33445c">
  <p>Welcome to <strong><?= e($site) ?></strong>. By using this website and our services, you agree to the following terms.</p>

  <h2 style="color:var(--blue)">Our Services</h2>
  <p>We provide educational consultancy and admission guidance. We help students choose courses and universities and assist with the application process. Final admission decisions and eligibility are determined by the respective universities.</p>

  <h2 style="color:var(--blue)">Information Accuracy</h2>
  <p>We strive to keep course, fee and university details accurate and up to date. However, these are subject to change by the universities, and we recommend confirming details with our counselors before applying.</p>

  <h2 style="color:var(--blue)">Your Responsibilities</h2>
  <p>You agree to provide accurate information in your enquiries and applications, and to submit genuine documents required for admission.</p>

  <h2 style="color:var(--blue)">Fees</h2>
  <p>Course fees are set by the universities. Any consultancy charges, if applicable, will be communicated to you clearly in advance.</p>

  <h2 style="color:var(--blue)">Contact</h2>
  <p>For any questions about these terms, please <a href="<?= e(url('contact.php')) ?>">contact us</a>.</p>
</div></div></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
