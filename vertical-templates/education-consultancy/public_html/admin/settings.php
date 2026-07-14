<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Settings'; $adminActive = 'settings';

$textFields = ['site_name','tagline','phone','phone2','email','whatsapp','address','business_hours',
    'facebook','instagram','youtube','twitter','linkedin','notify_email',
    'hero_title','hero_tagline','hero_subtitle','about_short','mission','vision','footer_about','seo_description','seo_keywords','popup_delay'];
$secKeys = ['sec_partners','sec_modes','sec_popular','sec_process','sec_why','sec_featured','sec_stats','sec_testimonials','sec_blog'];
$bigFields = ['about_full','map_embed'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? '';
    if ($act === 'settings') {
        foreach (array_merge($textFields, $bigFields) as $f) set_setting($f, trim($_POST[$f] ?? ''));
        set_setting('popup_enabled', isset($_POST['popup_enabled']) ? '1' : '0');
        set_setting('hero_mode', ($_POST['hero_mode'] ?? 'static') === 'slider' ? 'slider' : 'static');
        foreach ($secKeys as $sk) set_setting($sk, isset($_POST[$sk]) ? '1' : '0');
        flash('Settings saved.'); redirect(url('admin/settings.php'));
    } elseif ($act === 'theme') {
        $th = $_POST['theme'] ?? 'navy';
        if (!isset(themes()[$th])) $th = 'navy';
        set_setting('theme', $th);
        flash('Theme updated to "' . themes()[$th]['label'] . '".');
        redirect(url('admin/settings.php'));
    } elseif ($act === 'branding') {
        $err = null;
        $logo = handle_upload('site_logo_file', $err);
        if ($err) { flash($err, 'error'); redirect(url('admin/settings.php')); }
        if ($logo) { delete_upload(setting('site_logo', '')); set_setting('site_logo', $logo); }
        $fav = handle_upload('favicon_file', $err);
        if ($err) { flash($err, 'error'); redirect(url('admin/settings.php')); }
        if ($fav) { delete_upload(setting('favicon', '')); set_setting('favicon', $fav); }
        foreach (['hero_image'=>'hero_image_file','about_image'=>'about_image_file','services_image'=>'services_image_file','contact_image'=>'contact_image_file','events_image'=>'events_image_file'] as $key=>$field) {
            $up = handle_upload($field, $err);
            if ($err) { flash($err, 'error'); redirect(url('admin/settings.php')); }
            if ($up) { delete_upload(setting($key, '')); set_setting($key, $up); }
            if (isset($_POST['remove_' . $key])) { delete_upload(setting($key,'')); set_setting($key,''); }
        }
        if (isset($_POST['remove_logo'])) { delete_upload(setting('site_logo','')); set_setting('site_logo',''); }
        if (isset($_POST['remove_favicon'])) { delete_upload(setting('favicon','')); set_setting('favicon',''); }
        flash('Branding updated.');
        redirect(url('admin/settings.php'));
    } elseif ($act === 'password') {
        $cur = $_POST['current'] ?? ''; $new = $_POST['new'] ?? ''; $new2 = $_POST['new2'] ?? '';
        $st = db()->prepare('SELECT * FROM admins WHERE id=?'); $st->execute([$_SESSION['admin_id']]); $admin = $st->fetch();
        if (!$admin || !password_verify($cur, $admin['password_hash'])) flash('Current password is incorrect.', 'error');
        elseif (strlen($new) < 6) flash('New password must be at least 6 characters.', 'error');
        elseif ($new !== $new2) flash('New passwords do not match.', 'error');
        else { db()->prepare('UPDATE admins SET password_hash=? WHERE id=?')->execute([password_hash($new, PASSWORD_DEFAULT), $_SESSION['admin_id']]); flash('Password changed.'); }
        redirect(url('admin/settings.php'));
    }
}
function sv($k){ return e(setting($k)); }
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0">Website Theme</h2>
  <p class="muted">Pick a colour theme — it instantly changes the whole website.</p>
  <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="theme">
    <div class="theme-picker">
      <?php $cur = setting('theme','navy'); foreach (themes() as $id=>$t): ?>
        <label class="theme-opt <?= $cur===$id?'active':'' ?>">
          <input type="radio" name="theme" value="<?= e($id) ?>" <?= $cur===$id?'checked':'' ?> onchange="this.form.submit()">
          <span class="sw"><i style="background:<?= e($t['navy']) ?>"></i><i style="background:<?= e($t['sky']) ?>"></i><i style="background:<?= e($t['accent']) ?>"></i></span>
          <span class="tl"><?= e($t['label']) ?></span>
        </label>
      <?php endforeach; ?>
    </div>
    <div style="margin-top:14px"><button class="btn">Apply Theme</button></div>
  </form>
</div>

<div class="card">
  <h2 style="margin-top:0">Branding (Logo &amp; Favicon)</h2>
  <p class="muted">Upload your <strong>full logo</strong> (with name) for the header/footer, and the <strong>icon-only logo</strong> for the browser tab (favicon). PNG with transparent background works best.</p>
  <form method="post" enctype="multipart/form-data"><?= csrf_field() ?>
    <input type="hidden" name="action" value="branding">
    <div class="row2">
      <div>
        <label>Website Logo (full, with name)</label>
        <input type="file" name="site_logo_file" accept="image/*">
        <?php if (setting('site_logo')): ?>
          <div style="margin-top:8px;background:#0e2a54;border-radius:8px;padding:10px;display:inline-block"><img src="<?= e(site_logo_url()) ?>" style="height:40px"></div>
          <label style="font-weight:normal;margin-top:6px"><input type="checkbox" name="remove_logo" style="width:auto"> Remove current logo</label>
        <?php endif; ?>
      </div>
      <div>
        <label>Favicon / Icon (without name)</label>
        <input type="file" name="favicon_file" accept="image/*">
        <div style="margin-top:8px;background:#f2f5fb;border-radius:8px;padding:8px;display:inline-block"><img src="<?= e(favicon_url()) ?>" style="height:40px"></div>
        <?php if (setting('favicon')): ?><label style="font-weight:normal;margin-top:6px"><input type="checkbox" name="remove_favicon" style="width:auto"> Remove current favicon</label><?php endif; ?>
      </div>
    </div>
    <h3 style="color:var(--blue);margin-top:22px">Page Hero Photos <span class="help">(optional — shown on the right side of each page's top banner)</span></h3>
    <div class="row2">
      <?php foreach (['hero_image'=>'Home Hero','about_image'=>'About Page','services_image'=>'Services Page','contact_image'=>'Contact Page','events_image'=>'Events Page'] as $key=>$lbl): ?>
        <div>
          <label><?= e($lbl) ?></label>
          <input type="file" name="<?= e($key) ?>_file" accept="image/*">
          <?php if (setting($key)): ?>
            <div style="margin-top:6px"><img src="<?= e(upload_url(setting($key))) ?>" style="height:46px;border-radius:6px"></div>
            <label style="font-weight:normal;margin-top:4px"><input type="checkbox" name="remove_<?= e($key) ?>" style="width:auto"> Remove</label>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
    <div style="margin-top:16px"><button class="btn">Save branding &amp; images</button></div>
  </form>
</div>

<div class="card">
  <h2 style="margin-top:0">Site identity</h2>
  <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="settings">
    <div class="row2">
      <div><label>Site name</label><input name="site_name" value="<?= sv('site_name') ?>"></div>
      <div><label>Tagline</label><input name="tagline" value="<?= sv('tagline') ?>"></div>
    </div>

    <h3 style="color:var(--blue);margin-top:24px">Contact details</h3>
    <div class="row2">
      <div><label>Phone</label><input name="phone" value="<?= sv('phone') ?>"></div>
      <div><label>Phone 2 <span class="help">(optional)</span></label><input name="phone2" value="<?= sv('phone2') ?>"></div>
    </div>
    <div class="row2">
      <div><label>Public email</label><input name="email" value="<?= sv('email') ?>"></div>
      <div><label>WhatsApp number <span class="help">(digits with country code, e.g. 919102129391)</span></label><input name="whatsapp" value="<?= sv('whatsapp') ?>"></div>
    </div>
    <div class="row2">
      <div><label>Address</label><input name="address" value="<?= sv('address') ?>"></div>
      <div><label>Business hours</label><input name="business_hours" value="<?= sv('business_hours') ?>"></div>
    </div>
    <div><label>Notification email <span class="help">(where new form alerts are sent)</span></label><input name="notify_email" value="<?= sv('notify_email') ?>"></div>

    <h3 style="color:var(--blue);margin-top:24px">Social links</h3>
    <div class="row2">
      <div><label>Facebook</label><input name="facebook" value="<?= sv('facebook') ?>"></div>
      <div><label>Instagram</label><input name="instagram" value="<?= sv('instagram') ?>"></div>
    </div>
    <div class="row2">
      <div><label>YouTube</label><input name="youtube" value="<?= sv('youtube') ?>"></div>
      <div><label>LinkedIn</label><input name="linkedin" value="<?= sv('linkedin') ?>"></div>
    </div>
    <div><label>Twitter / X</label><input name="twitter" value="<?= sv('twitter') ?>"></div>

    <h3 style="color:var(--blue);margin-top:24px">Home Hero</h3>
    <label>Hero style</label>
    <div style="display:flex;gap:20px;margin-bottom:6px">
      <label style="font-weight:normal"><input type="radio" name="hero_mode" value="static" style="width:auto" <?= setting('hero_mode','static')!=='slider'?'checked':'' ?>> Static banner (editable text below)</label>
      <label style="font-weight:normal"><input type="radio" name="hero_mode" value="slider" style="width:auto" <?= setting('hero_mode','static')==='slider'?'checked':'' ?>> Rotating slider (from <a href="<?= e(url('admin/sliders.php')) ?>">Home Sliders</a>)</label>
    </div>
    <div class="row2">
      <div><label>Hero title <span class="help">(last 2 words shown in gold)</span></label><input name="hero_title" value="<?= sv('hero_title') ?>"></div>
      <div><label>Hero tagline <span class="help">(e.g. Online · Distance · Regular)</span></label><input name="hero_tagline" value="<?= sv('hero_tagline') ?>"></div>
    </div>
    <label>Hero subtitle</label><input name="hero_subtitle" value="<?= sv('hero_subtitle') ?>">
    <p class="help" style="margin:6px 0 0">Hero photo can be uploaded in the Branding section above (Home Hero). Stats shown come from <a href="<?= e(url('admin/stats.php')) ?>">Stats / Counters</a>.</p>

    <h3 style="color:var(--blue);margin-top:24px">More Text</h3>
    <label>About (short) <span class="help">(home page)</span></label><input name="about_short" value="<?= sv('about_short') ?>">
    <label>About (full) <span class="help">(About page — blank line between paragraphs)</span></label>
    <textarea name="about_full" style="min-height:130px"><?= sv('about_full') ?></textarea>
    <div class="row2">
      <div><label>Mission</label><textarea name="mission"><?= sv('mission') ?></textarea></div>
      <div><label>Vision</label><textarea name="vision"><?= sv('vision') ?></textarea></div>
    </div>
    <label>Footer about text</label><input name="footer_about" value="<?= sv('footer_about') ?>">

    <h3 style="color:var(--blue);margin-top:24px">Auto popup</h3>
    <label style="font-weight:normal"><input type="checkbox" name="popup_enabled" style="width:auto" <?= setting('popup_enabled','1')==='1'?'checked':'' ?>> Automatically open the consultation popup on the home page (once per visitor session)</label>
    <div style="max-width:260px"><label>Popup delay (milliseconds)</label><input type="number" name="popup_delay" value="<?= e(setting('popup_delay','1200')) ?>"></div>

    <h3 style="color:var(--blue);margin-top:24px">SEO & Map</h3>
    <label>Meta description</label><input name="seo_description" value="<?= sv('seo_description') ?>">
    <label>Meta keywords</label><input name="seo_keywords" value="<?= sv('seo_keywords') ?>">
    <label>Google Maps embed code <span class="help">(paste the full &lt;iframe&gt; from Google Maps → Share → Embed)</span></label>
    <textarea name="map_embed" style="min-height:90px"><?= e(setting('map_embed')) ?></textarea>

    <h3 style="color:var(--blue);margin-top:24px">Home Page Layout <span class="help">(show / hide sections on the home page)</span></h3>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      <?php
      $secLabels = ['sec_partners'=>'University Partners','sec_modes'=>'Learning Modes','sec_popular'=>'Popular Courses',
        'sec_process'=>'Admission Process','sec_why'=>'Why Choose Us','sec_featured'=>'Featured Universities',
        'sec_stats'=>'Stats Counter','sec_testimonials'=>'Testimonials','sec_blog'=>'Latest Blog'];
      foreach ($secLabels as $k=>$lbl): ?>
        <label style="font-weight:normal"><input type="checkbox" name="<?= e($k) ?>" style="width:auto" <?= setting($k,'1')==='1'?'checked':'' ?>> <?= e($lbl) ?></label>
      <?php endforeach; ?>
    </div>

    <div style="margin-top:18px"><button class="btn">Save all settings</button></div>
  </form>
</div>

<div class="card">
  <h2 style="margin-top:0">Change my password</h2>
  <form method="post" style="max-width:420px"><?= csrf_field() ?><input type="hidden" name="action" value="password">
    <label>Current password</label><input type="password" name="current" required>
    <label>New password</label><input type="password" name="new" required>
    <label>Confirm new password</label><input type="password" name="new2" required>
    <div style="margin-top:16px"><button class="btn">Change password</button></div>
  </form>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
