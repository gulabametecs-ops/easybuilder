<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'Privacy Policy — ' . setting('site_name', SITE_NAME);
$activePage = '';
$site = setting('site_name', SITE_NAME);
include __DIR__ . '/partials/header.php';
?>
<section class="page-hero"><div class="container-wrap"><h1>Privacy Policy</h1>
  <div class="crumb"><a href="<?= e(url('index.php')) ?>">Home</a> / Privacy Policy</div></div></section>

<section class="section"><div class="container-wrap"><div class="article" style="color:#33445c">
  <p>At <strong><?= e($site) ?></strong>, we respect your privacy and are committed to protecting the personal information you share with us. This policy explains what we collect and how we use it.</p>

  <h2 style="color:var(--blue)">Information We Collect</h2>
  <p>When you submit an enquiry, consultation, application or contact form, we may collect your name, email, mobile number, date of birth, and your course/university of interest. We also collect your email when you subscribe to our newsletter.</p>

  <h2 style="color:var(--blue)">How We Use Your Information</h2>
  <p>We use your information only to respond to your enquiries, guide you through the admission process, share relevant course updates, and improve our services. We never sell your personal data to third parties.</p>

  <h2 style="color:var(--blue)">Data Security</h2>
  <p>Your information is stored securely and access is limited to our authorised team. We take reasonable measures to protect it from unauthorised access or disclosure.</p>

  <h2 style="color:var(--blue)">Your Choices</h2>
  <p>You can ask us to update or delete your information, or unsubscribe from our newsletter, at any time by contacting us at <a href="mailto:<?= e(setting('email')) ?>"><?= e(setting('email')) ?></a>.</p>

  <h2 style="color:var(--blue)">Contact Us</h2>
  <p>If you have any questions about this Privacy Policy, please <a href="<?= e(url('contact.php')) ?>">contact us</a> — we're happy to help.</p>
</div></div></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
