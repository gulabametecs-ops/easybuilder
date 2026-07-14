<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle  = setting('site_name', SITE_NAME) . ' — ' . setting('tagline', 'Educational Consultancy');
$activePage = 'home';
$autoPopup  = true;

$slides       = sliders();
$statList     = stats();
$unis         = universities();
$grouped      = courses_grouped();
$posts        = blog_posts(3);
$reviews      = testimonials();
$totalCourses = (int)db()->query('SELECT COUNT(*) FROM courses WHERE is_active=1')->fetchColumn();
$partnerList  = partners();
if (!$partnerList) {
    $partnerList = array_map(fn($u) => ['name' => $u['name'], 'logo' => $u['logo'], 'link' => 'university.php?slug=' . $u['slug']], $unis);
}

$heroMode  = setting('hero_mode', 'static');
$heroTitle = setting('hero_title', "India's Trusted Higher Education Admission Partner");
$hw = explode(' ', trim($heroTitle));
$hlead = count($hw) > 2 ? implode(' ', array_slice($hw, 0, -2)) : $heroTitle;
$hglow = count($hw) > 2 ? implode(' ', array_slice($hw, -2)) : '';
$heroImg = setting('hero_image', '') ?: ($slides[0]['image'] ?? '');
function on($k){ return setting($k, '1') === '1'; }

include __DIR__ . '/partials/header.php';
?>

<?php if ($heroMode === 'slider' && $slides): ?>
<!-- HERO: SLIDER MODE -->
<section class="slider">
  <?php foreach ($slides as $i => $s): $bg = $s['image'] ? 'background-image:url(' . e(upload_url($s['image'])) . ')' : ''; ?>
    <div class="slide <?= $i===0?'active':'' ?>" style="<?= $bg ?>">
      <div class="slide-inner">
        <h1><?= e($s['title']) ?></h1>
        <?php if ($s['subtitle']): ?><p><?= e($s['subtitle']) ?></p><?php endif; ?>
        <?php if ($s['button_text']): ?>
          <?php if ($s['button_link']==='#consult'): ?><button class="btn btn-accent" onclick="openConsult()"><?= e($s['button_text']) ?></button>
          <?php else: ?><a class="btn btn-accent" href="<?= e(url($s['button_link'])) ?>"><?= e($s['button_text']) ?></a><?php endif; ?>
        <?php else: ?><button class="btn btn-accent" onclick="openConsult()">Apply Now</button><?php endif; ?>
      </div>
    </div>
  <?php endforeach; ?>
</section>
<?php else: ?>
<!-- HERO: STATIC MODE (editable from Settings) -->
<section class="hero2 hero2-photo-mode">
  <div class="hero2-edge"></div>
  <div class="hero2-photo" <?= $heroImg ? 'style="background-image:url(' . e(upload_url($heroImg)) . ')"' : '' ?>>
    <?php if (!$heroImg) echo edu_illustration(); ?>
  </div>
  <div class="container-wrap hero2-inner2">
    <div class="hero2-left">
      <h1><?= e($hlead) ?> <?php if($hglow): ?><span class="g"><?= e($hglow) ?></span><?php endif; ?></h1>
      <?php if (setting('hero_tagline')): ?><p class="modes-line"><?= e(setting('hero_tagline')) ?></p><?php endif; ?>
      <p class="lead"><?= e(setting('hero_subtitle')) ?></p>
      <div class="hero2-stats">
        <?php $hicons=['building','cap','users','shield']; foreach (array_slice($statList,0,4) as $i=>$s): ?>
          <div class="hero2-stat"><span class="hs-ic"><?= svg_icon($hicons[$i%4]) ?></span>
            <div><div class="n"><?= (int)$s['value'].e($s['suffix']) ?></div><div class="l"><?= e($s['label']) ?></div></div></div>
        <?php endforeach; ?>
      </div>
      <div class="hero2-cta">
        <button class="btn btn-accent" onclick="openConsult()">Apply Now</button>
        <button class="btn btn-ghost" onclick="openConsult()">Free Counselling</button>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if (on('sec_partners') && $partnerList): ?>
<section class="partners-strip"><div class="container-wrap">
  <div class="ps-head"><span class="dash"></span> Our University Partners <span class="dash"></span></div>
  <div class="ps-wrap">
    <div class="ps-track" id="psTrack">
      <?php foreach ($partnerList as $p): $hasLogo = trim((string)$p['logo'])!=='' && (is_file(__DIR__.'/assets/uploads/'.$p['logo']) || is_file(__DIR__.'/assets/images/'.$p['logo']));
        $lnk = trim((string)($p['link'] ?? '')); $href = $lnk!=='' ? (preg_match('#^https?://#',$lnk)?$lnk:url($lnk)) : ''; $tag = $href!=='' ? 'a' : 'span'; ?>
        <<?= $tag ?> class="ps-logo"<?= $href!==''?' href="'.e($href).'"':'' ?> title="<?= e($p['name']) ?>">
          <?php if ($hasLogo): ?><img src="<?= e(uni_logo($p['logo'])) ?>" alt="<?= e($p['name']) ?>"><?php else: ?><span class="nm"><?= e($p['name']) ?></span><?php endif; ?>
        </<?= $tag ?>>
      <?php endforeach; ?>
    </div>
    <?php if (count($partnerList) > 4): ?><button class="ps-arrow" onclick="document.getElementById('psTrack').scrollBy({left:320,behavior:'smooth'})" aria-label="Next"><?= svg_icon('arrow') ?></button><?php endif; ?>
  </div>
</div></section>
<?php endif; ?>

<?php if (on('sec_modes')): ?>
<section class="section alt"><div class="container-wrap">
  <span class="section-eyebrow">Choose Your Learning Mode</span>
  <h2 class="section-title">Study the Way That Suits You</h2>
  <div class="modes-grid">
    <?php foreach ([['monitor','Online Learning','UG, PG & Diploma programs from top universities with flexible online learning.'],
        ['cap','Distance Education','UG, PG & Diploma programs approved by UGC-DEB from reputed universities.'],
        ['building','Regular Courses','Full-time UG, PG & Diploma programs on campus with the best learning experience.'],
        ['clock','Part Time Programs','Upgrade your skills with our industry-focused part-time and weekend programs.']] as $m): ?>
      <div class="mode-card"><div class="mode-ic"><?= svg_icon($m[0]) ?></div><h3><?= e($m[1]) ?></h3><p><?= e($m[2]) ?></p>
        <a class="lm" href="<?= e(url('courses.php')) ?>">Learn More <?= svg_icon('arrow') ?></a></div>
    <?php endforeach; ?>
  </div>
</div></section>
<?php endif; ?>

<?php if (on('sec_popular')): ?>
<section class="section"><div class="container-wrap">
  <div class="popular-wrap">
    <div class="popular-left">
      <span class="section-eyebrow" style="text-align:left">Popular Courses</span>
      <h2>Explore Top Programs</h2>
      <p>Explore <?= $totalCourses ?>+ courses from India's leading universities across every field.</p>
      <a class="btn" href="<?= e(url('courses.php')) ?>">View All Courses</a>
    </div>
    <div class="course-links">
      <?php foreach (['MBA','BBA','BCA','MCA','B.Com','M.Com','BA','MA','B.Tech','M.Tech','B.Ed','LLB','Nursing','Diploma','Certificate','Ph.D'] as $pc): ?>
        <a href="<?= e(url('courses.php?q=' . urlencode($pc))) ?>"><?= e($pc) ?> <span class="ar"><?= svg_icon('arrow') ?></span></a>
      <?php endforeach; ?>
    </div>
  </div>
</div></section>
<?php endif; ?>

<?php if (on('sec_process')): ?>
<section class="section alt"><div class="container-wrap">
  <span class="section-eyebrow">Our Admission Process</span>
  <h2 class="section-title">Simple Steps to Your Admission</h2>
  <div class="process-steps">
    <?php foreach ([['headset','Counselling','We understand your goals and preferences.'],
        ['building','University Selection','We help you choose the right university.'],
        ['doc','Document Verification','We verify and prepare your documents.'],
        ['clipboard','Application','We submit your application.'],
        ['shield','Admission Confirmation','Get your admission confirmed.']] as $i=>$s): ?>
      <div class="pstep"><div class="pcirc"><?= svg_icon($s[0]) ?><span class="pnum"><?= $i+1 ?></span></div><h3><?= e($s[1]) ?></h3><p><?= e($s[2]) ?></p></div>
    <?php endforeach; ?>
  </div>
</div></section>
<?php endif; ?>

<?php if (on('sec_why')): ?>
<section class="section"><div class="container-wrap why2">
  <div class="why2-img"><?= edu_illustration() ?></div>
  <div>
    <span class="section-eyebrow" style="text-align:left">Why Choose Us</span>
    <h2 class="section-title">Why Choose <?= e(setting('site_name', SITE_NAME)) ?>?</h2>
    <ul class="why2-list">
      <?php foreach ([['Expert Counsellors','Personalised guidance from experienced education experts.'],
          ['Trusted University Partnerships','Tie-ups with top UGC-approved universities across India.'],
          ['Wide Range of Programs','Online, Distance, Regular & Part-Time programs available.'],
          ['End-to-End Admission Support','From counselling to admission — we are with you every step.'],
          ['Scholarship & Fee Guidance','We help you find the best scholarship and payment options.'],
          ['Career Guidance','We help you choose the right path for a better future.']] as $w): ?>
        <li><span class="ic"><?= svg_icon('check') ?></span><div><b><?= e($w[0]) ?></b><span class="d"><?= e($w[1]) ?></span></div></li>
      <?php endforeach; ?>
    </ul>
  </div>
</div></section>
<?php endif; ?>

<?php if (on('sec_featured') && $unis): ?>
<section class="section alt"><div class="container-wrap">
  <span class="section-eyebrow">Featured Universities</span>
  <h2 class="section-title">Top Universities We Work With</h2>
  <div class="funi-grid">
    <?php foreach (array_slice($unis,0,3) as $u): $cc=count($grouped[$u['id']]??[]); ?>
      <div class="funi-card"><img class="funi-logo" src="<?= e(uni_logo($u['logo'])) ?>" alt="<?= e($u['name']) ?>">
        <h3><?= e($u['name']) ?></h3><p><?= $cc ?>+ programs · <?= e($u['location'] ?: 'Online & Distance') ?></p>
        <a class="btn btn-accent" href="<?= e(url('university.php?slug=' . urlencode($u['slug']))) ?>">View Programs</a></div>
    <?php endforeach; ?>
  </div>
</div></section>
<?php endif; ?>

<?php if (on('sec_stats') && $statList): ?>
<section class="stats-bar"><div class="container-wrap"><div class="stats-grid">
  <?php foreach ($statList as $s): ?>
    <div class="stat-item"><div class="stat-num" data-target="<?= (int)$s['value'] ?>"><?= (int)$s['value'] ?></div><span class="stat-num" style="font-size:36px"><?= e($s['suffix']) ?></span>
      <div class="stat-label"><?= e($s['label']) ?></div></div>
  <?php endforeach; ?>
</div></div></section>
<?php endif; ?>

<?php if (on('sec_testimonials') && $reviews): ?>
<section class="testimonials">
  <span class="section-eyebrow">Student Success Stories</span>
  <h2 class="section-title">What Our Students Say</h2>
  <div class="marquee"><div class="marquee-track">
    <?php foreach (array_merge($reviews,$reviews) as $t): ?>
      <div class="tcard"><p>&ldquo;<?= e($t['quote']) ?>&rdquo;</p><h4><?= e($t['student_name']) ?></h4><?php if($t['university']):?><span class="uni">(<?= e($t['university']) ?>)</span><?php endif;?></div>
    <?php endforeach; ?>
  </div></div>
</section>
<?php endif; ?>

<section class="cta-band">
  <h2>Need Help Choosing the Right Course?</h2>
  <p>Book your free career counselling session today.</p>
  <button class="btn btn-accent" onclick="openConsult()">Book Free Counselling</button>
</section>

<?php if (on('sec_blog') && $posts): ?>
<section class="section"><div class="container-wrap">
  <span class="section-eyebrow">Latest Updates</span>
  <h2 class="section-title">News &amp; Articles</h2>
  <div class="blog-grid">
    <?php foreach ($posts as $p): ?>
      <a class="blog-card" href="<?= e(url('blog-single.php?slug=' . urlencode($p['slug']))) ?>">
        <div class="thumb" style="background-image:url(<?= e(upload_url($p['image'])) ?>)"></div>
        <div class="body"><div class="meta"><?= e(date('M d, Y', strtotime($p['published_at'] ?: $p['created_at']))) ?></div>
          <h3><?= e($p['title']) ?></h3><p><?= e($p['excerpt'] ?: excerpt($p['content'])) ?></p>
          <span class="more">Read More <?= svg_icon('arrow') ?></span></div>
      </a>
    <?php endforeach; ?>
  </div>
</div></section>
<?php endif; ?>

<?php include __DIR__ . '/partials/footer.php'; ?>
