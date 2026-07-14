<?php
require_once __DIR__ . '/inc/content.php';
$pageTitle = 'Courses — ' . setting('site_name', SITE_NAME);
$activePage = 'courses';
$unis = universities();
$uniById = []; foreach ($unis as $u) $uniById[$u['id']] = $u;

$q    = trim($_GET['q'] ?? '');
$cat  = trim($_GET['cat'] ?? '');
$mode = trim($_GET['mode'] ?? '');
$filter = trim($_GET['uni'] ?? '');
$activeUni = null; foreach ($unis as $u) if ($u['slug'] === $filter) $activeUni = $u;

$all = $activeUni ? courses((int)$activeUni['id']) : courses();
$isFiltered = ($q !== '' || $cat !== '' || $mode !== '' || $activeUni);

// apply filters
$list = $all;
if ($q !== '')   $list = array_values(array_filter($list, fn($c)=>stripos($c['title'],$q)!==false));
if ($mode !== '')$list = array_values(array_filter($list, fn($c)=>stripos($c['title'],$mode)!==false));
if ($cat !== '') $list = array_values(array_filter($list, fn($c)=>course_category($c['title'])===$cat));

// group all courses by category (for the directory columns)
$byCat = [];
foreach ($all as $c) $byCat[course_category($c['title'])][] = $c;
$catIcon = ['Management & Business'=>'briefcase','Computer & IT'=>'monitor','Commerce & Finance'=>'chart',
    'Arts & Social Sciences'=>'users','Foreign Languages'=>'chat','Health & Wellness'=>'health',
    'Diplomas & Certificates'=>'award','Other Programs'=>'cap'];
$totalCourses = count($all);
include __DIR__ . '/partials/header.php';
?>
<!-- HERO -->
<section class="split-hero">
  <div class="sh-content">
    <span class="eyebrow">Our Courses</span>
    <h1>Explore <span class="g"><?= $totalCourses ?>+ Courses</span><br>Across Top Universities in India</h1>
    <div class="divider"></div>
    <p>Choose from a wide range of Online, Distance, Regular and Part-Time courses including UG, PG, Diploma and Certification programs.</p>
  </div>
  <div class="sh-media"><?= edu_illustration() ?></div>
</section>

<section class="section"><div class="container-wrap">
  <!-- search / filter row (auto-filters on change) -->
  <form class="course-search-row" method="get" action="<?= e(url('courses.php')) ?>">
    <select name="uni" onchange="this.form.submit()">
      <option value="">All Universities</option>
      <?php foreach ($unis as $u): ?>
        <option value="<?= e($u['slug']) ?>" <?= $filter===$u['slug']?'selected':'' ?>><?= e($u['name']) ?></option>
      <?php endforeach; ?>
    </select>
    <select name="q" onchange="this.form.submit()">
      <option value="">All Levels</option>
      <?php foreach (['Bachelor'=>'Undergraduate (UG)','Master'=>'Postgraduate (PG)','Diploma'=>'Diploma','Certificate'=>'Certificate'] as $v=>$lbl): ?>
        <option value="<?= e($v) ?>" <?= $q===$v?'selected':'' ?>><?= e($lbl) ?></option>
      <?php endforeach; ?>
    </select>
    <select name="cat" onchange="this.form.submit()">
      <option value="">All Categories</option>
      <?php foreach (course_category_order() as $cn): if(empty($byCat[$cn]))continue; ?>
        <option value="<?= e($cn) ?>" <?= $cat===$cn?'selected':'' ?>><?= e($cn) ?></option>
      <?php endforeach; ?>
    </select>
    <select name="mode" onchange="this.form.submit()">
      <option value="">All Learning Modes</option>
      <?php foreach (['Online'=>'Online','Distance'=>'Distance','Executive'=>'Regular / Full Time','Certificate'=>'Part-Time / Certificate'] as $v=>$lbl): ?>
        <option value="<?= e($v) ?>" <?= $mode===$v?'selected':'' ?>><?= e($lbl) ?></option>
      <?php endforeach; ?>
    </select>
    <button type="submit"><?= svg_icon('search') ?> Search</button>
  </form>

  <?php if ($isFiltered): ?>
    <!-- FILTERED RESULTS -->
    <p class="section-sub" style="margin:26px 0 20px"><?= count($list) ?> course<?= count($list)===1?'':'s' ?> found.
      <a href="<?= e(url('courses.php')) ?>">Reset</a></p>
    <?php if ($list): $g2=[]; foreach($list as $c) $g2[course_category($c['title'])][]=$c; ?>
      <?php foreach (course_category_order() as $cn): if(empty($g2[$cn]))continue; ?>
        <div class="cat-block">
          <div class="cat-head"><span class="cat-ic"><?= svg_icon($catIcon[$cn]??'cap') ?></span><h2><?= e($cn) ?></h2><span class="cat-count"><?= count($g2[$cn]) ?></span></div>
          <div class="xcard-grid">
            <?php foreach ($g2[$cn] as $c){ $un=$activeUni?$activeUni['name']:($c['university_name']??($uniById[$c['university_id']]['name']??'')); echo course_card_html($c['title'],$un,$c['level']??'',$c['duration']??''); } ?>
          </div>
        </div>
      <?php endforeach; ?>
    <?php else: ?><p class="section-sub">No courses matched. <button class="btn" onclick="openConsult()">Ask our team</button></p><?php endif; ?>

  <?php else: ?>
    <!-- DIRECTORY -->
    <div class="course-explorer">
      <aside>
        <div class="side-box"><h4>COURSE LEVEL</h4>
          <?php foreach (['Bachelor'=>'Undergraduate (UG)','Master'=>'Postgraduate (PG)','Diploma'=>'Diploma','Certificate'=>'Certificate','Ph.D'=>'Doctorate (Ph.D)'] as $v=>$lbl): ?>
            <a href="<?= e(url('courses.php?q=' . urlencode($v))) ?>"><span class="ci"><?= svg_icon('cap') ?><?= e($lbl) ?></span><?= svg_icon('arrow') ?></a>
          <?php endforeach; ?>
        </div>
        <div class="side-box"><h4>LEARNING MODE</h4>
          <?php foreach (['Online'=>'Online Programs','Distance'=>'Distance Education','Executive'=>'Regular / Full Time','Certificate'=>'Part-Time Programs'] as $v=>$lbl): ?>
            <a href="<?= e(url('courses.php?mode=' . urlencode($v))) ?>"><span class="ci"><?= svg_icon('monitor') ?><?= e($lbl) ?></span><?= svg_icon('arrow') ?></a>
          <?php endforeach; ?>
        </div>
      </aside>
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span class="section-eyebrow" style="text-align:left;margin:0">Popular Courses</span>
          <a class="mode-card" style="color:var(--accent-d);font-weight:700" href="<?= e(url('courses.php?cat=' . urlencode('Management & Business'))) ?>">View All Courses <?= svg_icon('arrow') ?></a>
        </div>
        <div class="cat-columns" style="margin-top:18px">
          <?php foreach (course_category_order() as $cn): if(empty($byCat[$cn]))continue; $items=array_slice($byCat[$cn],0,5); ?>
            <div class="cat-col">
              <h4><?= svg_icon($catIcon[$cn]??'cap') ?> <?= e($cn) ?></h4>
              <?php foreach ($items as $c): ?>
                <a href="<?= e(url('courses.php?q=' . urlencode($c['title']))) ?>"><?= e($c['title']) ?> <?= svg_icon('arrow') ?></a>
              <?php endforeach; ?>
              <a class="viewall" href="<?= e(url('courses.php?cat=' . urlencode($cn))) ?>">View All <?= svg_icon('arrow') ?></a>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  <?php endif; ?>
</div></section>

<!-- MINI FEATURES -->
<section class="mini-features"><div class="container-wrap">
  <div class="mini-feature"><span class="mic"><?= svg_icon('cap') ?></span><div><b><?= $totalCourses ?>+ Courses</b><span>Wide range of programs across streams &amp; levels.</span></div></div>
  <div class="mini-feature"><span class="mic"><?= svg_icon('building') ?></span><div><b><?= count($unis) ?>+ Top Universities</b><span>Recognized universities across India.</span></div></div>
  <div class="mini-feature"><span class="mic"><?= svg_icon('shield') ?></span><div><b>Flexible Learning</b><span>Online, Distance, Regular &amp; Part-Time.</span></div></div>
  <div class="mini-feature"><span class="mic"><?= svg_icon('headset') ?></span><div><b>Expert Guidance</b><span>Personalized counselling to choose right.</span></div></div>
</div></section>

<!-- CTA -->
<section class="cta-band"><h2>Not Sure Which Course is Right for You?</h2>
  <p>Our experts are here to help you choose the perfect course based on your goals and interests.</p>
  <button class="btn btn-accent" onclick="openConsult()">Book Free Counselling</button></section>
<?php include __DIR__ . '/partials/footer.php'; ?>
