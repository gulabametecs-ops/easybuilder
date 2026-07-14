<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'Contact Us — ' . setting('site_name', SITE_NAME);
$activePage = 'contact';
$wa = preg_replace('/\D/', '', setting('whatsapp'));
$img = setting('contact_image', '');
include __DIR__ . '/partials/header.php';
?>
<section class="split-hero">
  <div class="sh-content">
    <span class="eyebrow">Contact Us</span>
    <h1>We're Here to Help You<br>Achieve Your Dreams</h1>
    <div class="divider"></div>
    <p>Have questions about admissions, courses, or universities? Our experts are ready to assist you at every step.</p>
  </div>
  <div class="sh-media" <?= $img ? 'style="background-image:url(' . e(upload_url($img)) . ')"' : '' ?>>
    <?php if (!$img) echo edu_illustration(); ?>
  </div>
</section>

<section class="section"><div class="container-wrap contact-layout">
  <div class="contact-form-card">
    <h3>Send Us a Message</h3>
    <div class="notice ok" id="ctOk" style="display:none;margin-top:16px">Thank you! Your message has been sent. We'll reply soon.</div>
    <div class="notice bad" id="ctErr" style="display:none;margin-top:16px"></div>
    <form id="contactForm" onsubmit="return submitContact(event)" style="margin-top:16px">
      <input type="hidden" name="type" value="contact">
      <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
      <div class="row2" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-row"><label>Full Name *</label><input type="text" name="name" placeholder="Enter your full name" required></div>
        <div class="form-row"><label>Email Address *</label><input type="email" name="email" placeholder="Enter your email address" required></div>
      </div>
      <div class="row2" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-row"><label>Phone Number *</label><input type="tel" name="mobile" placeholder="Enter your phone number" required></div>
        <div class="form-row"><label>Subject *</label>
          <select name="course" required>
            <option value="">Select a subject</option>
            <option>Admission Enquiry</option><option>Course Information</option><option>University Selection</option>
            <option>Fee &amp; Scholarship</option><option>General Query</option>
          </select>
        </div>
      </div>
      <div class="form-row"><label>Your Message *</label><textarea name="message" placeholder="Type your message here..." required></textarea></div>
      <button class="btn btn-accent" type="submit">Send Message</button>
    </form>
  </div>

  <div class="contact-info">
    <h3>Get In Touch</h3>
    <ul class="cinfo-list">
      <?php if (setting('phone')): ?><li><span class="cic"><?= svg_icon('phone') ?></span><div><b>Call Us</b><a href="tel:<?= e(setting('phone')) ?>"><?= e(setting('phone')) ?></a><?php if(setting('business_hours')):?><br><span>(<?= e(setting('business_hours')) ?>)</span><?php endif;?></div></li><?php endif; ?>
      <?php if ($wa): ?><li><span class="cic"><?= svg_icon('handshake') ?></span><div><b>WhatsApp Us</b><a href="https://wa.me/<?= e($wa) ?>" target="_blank" rel="noopener"><?= e(setting('whatsapp')) ?></a><br><span>(Quick Response)</span></div></li><?php endif; ?>
      <?php if (setting('email')): ?><li><span class="cic"><?= svg_icon('mail') ?></span><div><b>Email Us</b><a href="mailto:<?= e(setting('email')) ?>"><?= e(setting('email')) ?></a></div></li><?php endif; ?>
      <?php if (setting('address')): ?><li><span class="cic"><?= svg_icon('pin') ?></span><div><b>Visit Our Office</b><span><?= e(setting('address')) ?></span></div></li><?php endif; ?>
    </ul>
    <?php if (trim((string)setting('map_embed')) !== ''): ?>
      <div style="border-radius:12px;overflow:hidden;border:1px solid var(--line)"><?= setting('map_embed') ?></div>
    <?php else: ?>
      <div style="border-radius:12px;overflow:hidden;border:1px solid var(--line)">
        <iframe title="map" src="https://www.google.com/maps?q=<?= urlencode(setting('address','India')) ?>&output=embed" width="100%" height="240" style="border:0;display:block" loading="lazy"></iframe>
      </div>
    <?php endif; ?>
  </div>
</div></section>

<section class="mini-features"><div class="container-wrap">
  <div class="mini-feature"><span class="mic"><?= svg_icon('headset') ?></span><div><b>Free Counselling</b><span>Book a free counselling session with our experts.</span></div></div>
  <div class="mini-feature"><span class="mic"><?= svg_icon('clock') ?></span><div><b>Quick Response</b><span>We aim to respond to all inquiries within 24 hours.</span></div></div>
  <div class="mini-feature"><span class="mic"><?= svg_icon('shield') ?></span><div><b>100% Assistance</b><span>End-to-end support from course selection to admission.</span></div></div>
  <div class="mini-feature"><span class="mic"><?= svg_icon('star') ?></span><div><b>Student First</b><span>We are committed to your success and future.</span></div></div>
</div></section>

<script>
function submitContact(ev){ev.preventDefault();var form=document.getElementById('contactForm');var ok=document.getElementById('ctOk'),err=document.getElementById('ctErr');err.style.display='none';var btn=form.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Sending...';
fetch('api/submit.php',{method:'POST',body:new FormData(form)}).then(function(r){return r.json();}).then(function(res){if(res&&res.success){form.style.display='none';ok.style.display='block';}else{err.textContent=(res&&res.error)?res.error:'Something went wrong.';err.style.display='block';}}).catch(function(){err.textContent='Network error.';err.style.display='block';}).finally(function(){btn.disabled=false;btn.textContent='Send Message';});return false;}
</script>
<?php include __DIR__ . '/partials/footer.php'; ?>
