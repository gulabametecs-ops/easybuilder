<?php $waF = preg_replace('/\D/', '', setting('whatsapp')); ?>
<footer class="site-footer">
  <div class="container-wrap">
    <div class="sf-main" style="padding-top:44px">
      <!-- brand -->
      <div class="sf-brand">
        <img class="flogo" src="<?= e(site_logo_url()) ?>" alt="<?= e(setting('site_name', SITE_NAME)) ?>">
        <p><?= e(setting('footer_about', 'Guiding students to the right courses, universities and careers with honest, expert advice.')) ?></p>
        <div class="sf-social">
          <?php foreach (['facebook','instagram','youtube','linkedin','twitter'] as $k):
            if (setting($k)): ?><a href="<?= e(setting($k)) ?>" target="_blank" rel="noopener" aria-label="<?= e($k) ?>"><?= svg_icon($k) ?></a><?php endif; endforeach; ?>
        </div>
      </div>

      <!-- quick links -->
      <div>
        <h4>Quick Links</h4>
        <ul>
          <li><a href="<?= e(url('index.php')) ?>">Home</a></li>
          <li><a href="<?= e(url('about.php')) ?>">About Us</a></li>
          <li><a href="<?= e(url('universities.php')) ?>">Universities</a></li>
          <li><a href="<?= e(url('courses.php')) ?>">Courses</a></li>
          <li><a href="<?= e(url('blog.php')) ?>">Blog</a></li>
          <li><a href="<?= e(url('contact.php')) ?>">Contact Us</a></li>
        </ul>
      </div>

      <!-- our programs -->
      <div>
        <h4>Our Programs</h4>
        <ul>
          <li><a href="<?= e(url('courses.php')) ?>">Online Learning</a></li>
          <li><a href="<?= e(url('courses.php')) ?>">Distance Education</a></li>
          <li><a href="<?= e(url('courses.php')) ?>">Regular Courses</a></li>
          <li><a href="<?= e(url('courses.php')) ?>">Part-Time Programs</a></li>
          <li><a href="<?= e(url('courses.php?cat=' . urlencode('Diplomas & Certificates'))) ?>">Diploma Courses</a></li>
          <li><a href="<?= e(url('courses.php?cat=' . urlencode('Diplomas & Certificates'))) ?>">Certificate Courses</a></li>
        </ul>
      </div>

      <!-- support -->
      <div>
        <h4>Support</h4>
        <ul>
          <li><a href="<?= e(url('faq.php')) ?>">FAQ's</a></li>
          <li><a href="<?= e(url('events.php')) ?>">Events</a></li>
          <li><a href="<?= e(url('gallery.php')) ?>">Gallery</a></li>
          <li><a href="<?= e(url('privacy.php')) ?>">Privacy Policy</a></li>
          <li><a href="<?= e(url('terms.php')) ?>">Terms &amp; Conditions</a></li>
        </ul>
      </div>

      <!-- contact -->
      <div>
        <h4>Contact Us</h4>
        <ul class="sf-contact">
          <?php if (setting('address')): ?><li><?= svg_icon('pin') ?><span><?= e(setting('address')) ?></span></li><?php endif; ?>
          <?php if (setting('phone')): ?><li><?= svg_icon('phone') ?><a href="tel:<?= e(setting('phone')) ?>"><?= e(setting('phone')) ?></a></li><?php endif; ?>
          <?php if (setting('email')): ?><li><?= svg_icon('mail') ?><a href="mailto:<?= e(setting('email')) ?>"><?= e(setting('email')) ?></a></li><?php endif; ?>
        </ul>
        <div class="sf-news">
          <form onsubmit="return subscribeNews(event)">
            <input type="email" name="email" placeholder="Your email for updates" required>
            <button type="submit">Join</button>
          </form>
          <div class="news-msg" id="newsMsg" style="font-size:12px;margin-top:8px"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="sf-bottom">
    <div class="container-wrap">
      <span>&copy; <?= date('Y') ?> <?= e(setting('site_name', SITE_NAME)) ?>. All rights reserved.</span>
      <span><a href="<?= e(url('privacy.php')) ?>">Privacy Policy</a> · <a href="<?= e(url('terms.php')) ?>">Terms</a> · <a href="<?= e(url('faq.php')) ?>">FAQ</a> · <a href="<?= e(url('contact.php')) ?>">Contact</a></span>
    </div>
  </div>
</footer>

<?php $waFloat = preg_replace('/\D/', '', setting('whatsapp')); ?>
<?php if ($waFloat): ?>
<a class="wa-float" href="https://wa.me/<?= e($waFloat) ?>?text=<?= rawurlencode('Hello, I would like to know more about your courses.') ?>" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp" title="Chat on WhatsApp">
  <svg viewBox="0 0 448 512" fill="#fff"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 438.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
  <span class="wa-float-label">Chat with us</span>
</a>
<?php endif; ?>

<?php include __DIR__ . '/consultation-modal.php'; ?>
<script src="<?= e(asset('js/main.js')) ?>"></script>
</body></html>
