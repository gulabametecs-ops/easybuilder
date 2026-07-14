<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'Events — ' . setting('site_name', SITE_NAME);
$activePage = 'events';
$items = events();
$img = setting('events_image', '');
include __DIR__ . '/partials/header.php';
?>
<section class="split-hero dark">
  <div class="sh-content">
    <span class="eyebrow">Events</span>
    <h1>Engage. Learn. Grow.</h1>
    <div class="divider"></div>
    <p>Join our upcoming events, webinars, and university sessions to take the next step toward your future.</p>
    <div class="sh-feats">
      <span class="f"><?= svg_icon('users') ?> Expert Sessions</span>
      <span class="f"><?= svg_icon('building') ?> University Interactions</span>
      <span class="f"><?= svg_icon('monitor') ?> Webinars &amp; Workshops</span>
      <span class="f"><?= svg_icon('headset') ?> Career Guidance</span>
    </div>
  </div>
  <div class="sh-media" <?= $img ? 'style="background-image:url(' . e(upload_url($img)) . ')"' : '' ?>>
    <?php if (!$img) echo edu_illustration(); ?>
  </div>
</section>

<section class="section"><div class="container-wrap events-layout">
  <div>
    <span class="section-eyebrow" style="text-align:left">Upcoming Events</span>
    <h2 class="section-title" style="text-align:left;padding:0;margin:8px 0 24px">Don't Miss Out</h2>
    <?php if ($items): foreach ($items as $ev): $ts = $ev['event_date'] ? strtotime($ev['event_date']) : null; ?>
      <div class="event-row">
        <div class="ev-date">
          <div class="d"><?= $ts?date('d',$ts):'--' ?></div>
          <div class="m"><?= $ts?date('M Y',$ts):'TBA' ?></div>
          <?php if($ts):?><div class="day"><?= strtoupper(date('D',$ts)) ?></div><?php endif;?>
        </div>
        <div class="ev-thumb" <?= $ev['image']?'style="background-image:url('.e(upload_url($ev['image'])).')"':'' ?>><?php if(!$ev['image'])echo svg_icon('calendar');?></div>
        <div class="ev-body">
          <h3><?= e($ev['title']) ?></h3>
          <p><?= e(excerpt($ev['description'],110)) ?></p>
          <div class="ev-meta"><?php if($ev['location']):?><span><?= svg_icon('pin') ?> <?= e($ev['location']) ?></span><?php endif;?><?php if($ts):?><span><?= svg_icon('calendar') ?> <?= e(date('l, d M Y',$ts)) ?></span><?php endif;?></div>
        </div>
        <button class="ev-btn" onclick="openConsult()">Register Now <?= svg_icon('arrow') ?></button>
      </div>
    <?php endforeach; else: ?><p class="section-sub">No events scheduled right now. Check back soon!</p><?php endif; ?>
  </div>

  <aside>
    <div class="hl-box">
      <h4>Event Highlights</h4>
      <div class="hl-item"><span class="hic"><?= svg_icon('headset') ?></span><div><b>Interactive Sessions</b><span>Engage with experts and university delegates.</span></div></div>
      <div class="hl-item"><span class="hic"><?= svg_icon('users') ?></span><div><b>Personalized Guidance</b><span>Get answers to your specific questions.</span></div></div>
      <div class="hl-item"><span class="hic"><?= svg_icon('doc') ?></span><div><b>Latest Updates</b><span>Stay informed about admissions, courses, scholarships.</span></div></div>
      <div class="hl-item"><span class="hic"><?= svg_icon('star') ?></span><div><b>Exclusive Benefits</b><span>Attend events and get special offers on admissions.</span></div></div>
    </div>
    <div class="side-widget subscribe">
      <h4>Stay Updated</h4>
      <p class="muted" style="font-size:13px;margin-top:0">Subscribe to never miss an update on upcoming events.</p>
      <form onsubmit="return subscribeNews(event)"><input type="email" name="email" placeholder="Enter your email address" required><button type="submit">Subscribe Now</button></form>
      <div class="news-msg" id="newsMsg" style="font-size:12px;margin-top:8px"></div>
    </div>
  </aside>
</div></section>

<section class="cta-band"><h2>Can't Attend in Person?</h2>
  <p>Join our live webinars and online events from the comfort of your home.</p>
  <button class="btn btn-accent" onclick="openConsult()">Enquire About Webinars</button></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
