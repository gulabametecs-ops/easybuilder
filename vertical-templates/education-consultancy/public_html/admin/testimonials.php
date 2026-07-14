<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Testimonials'; $adminActive = 'testimonials';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $quote = trim($_POST['quote'] ?? '');
        $who   = trim($_POST['student_name'] ?? '');
        $uni   = trim($_POST['university'] ?? '');
        $rating= max(1, min(5, (int)($_POST['rating'] ?? 5)));
        $sort  = (int)($_POST['sort_order'] ?? 0);
        $active = isset($_POST['is_active']) ? 1 : 0;
        $err = null; $photo = handle_upload('photo_file', $err);
        if ($err) flash($err, 'error');
        elseif ($quote === '' || $who === '') flash('Quote and student name are required.', 'error');
        else {
            if ($id) {
                if (!$photo) $photo = trim($_POST['existing_photo'] ?? ''); else delete_upload($_POST['existing_photo'] ?? '');
                db()->prepare('UPDATE testimonials SET quote=?,student_name=?,university=?,photo=?,rating=?,sort_order=?,is_active=? WHERE id=?')
                   ->execute([$quote,$who,$uni,$photo,$rating,$sort,$active,$id]);
                flash('Testimonial updated.');
            } else {
                db()->prepare('INSERT INTO testimonials (quote,student_name,university,photo,rating,sort_order,is_active) VALUES (?,?,?,?,?,?,?)')
                   ->execute([$quote,$who,$uni,(string)$photo,$rating,$sort,$active]);
                flash('Testimonial added.');
            }
        }
    } elseif ($act === 'delete' && $id) {
        $st = db()->prepare('SELECT photo FROM testimonials WHERE id=?'); $st->execute([$id]); delete_upload($st->fetchColumn());
        db()->prepare('DELETE FROM testimonials WHERE id=?')->execute([$id]); flash('Testimonial deleted.');
    } elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE testimonials SET is_active=1-is_active WHERE id=?')->execute([$id]); }
    elseif ($act === 'marquee') { set_setting('marquee_enabled', isset($_POST['marquee_enabled'])?'1':'0'); flash('Marquee setting saved.'); }
    redirect(url('admin/testimonials.php'));
}

$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM testimonials WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM testimonials ORDER BY sort_order, id')->fetchAll();
$marqueeOn = setting('marquee_enabled','1') === '1';
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <form method="post" class="toolbar" style="margin:0"><?= csrf_field() ?>
    <input type="hidden" name="action" value="marquee">
    <strong>Testimonials marquee on home page:</strong>
    <label style="margin:0;font-weight:normal"><input type="checkbox" name="marquee_enabled" style="width:auto" <?= $marqueeOn?'checked':'' ?>> Enabled</label>
    <button class="btn sm" type="submit">Save</button>
    <span class="muted">When off, the "Our Happy Students" section is hidden site-wide.</span>
  </form>
</div>

<div class="card">
  <h2 style="margin-top:0"><?= $edit?'Edit testimonial':'Add a testimonial' ?></h2>
  <form method="post" enctype="multipart/form-data"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <input type="hidden" name="existing_photo" value="<?= e($edit['photo'] ?? '') ?>">
    <label>Quote</label><textarea name="quote" required><?= e($edit['quote'] ?? '') ?></textarea>
    <div class="row2">
      <div><label>Student name</label><input name="student_name" value="<?= e($edit['student_name'] ?? '') ?>" required></div>
      <div><label>University</label><input name="university" value="<?= e($edit['university'] ?? '') ?>"></div>
    </div>
    <div class="row2">
      <div><label>Rating (1-5)</label><input type="number" name="rating" min="1" max="5" value="<?= (int)($edit['rating'] ?? 5) ?>"></div>
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
    </div>
    <label>Student photo <span class="help">(optional)</span></label><input type="file" name="photo_file" accept="image/*">
    <?php if (!empty($edit['photo'])): ?><div style="margin-top:6px"><img class="thumb-sm" src="<?= e(upload_url($edit['photo'])) ?>"></div><?php endif; ?>
    <label style="font-weight:normal;margin-top:10px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Show in marquee</label>
    <div style="margin-top:16px"><button class="btn" type="submit"><?= $edit?'Save changes':'Add testimonial' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/testimonials.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>

<div class="card">
  <h2 style="margin-top:0">All testimonials (<?= count($rows) ?>)</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Quote</th><th>Student</th><th>University</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $t): ?>
    <tr>
      <td><?= (int)$t['sort_order'] ?></td>
      <td style="max-width:340px"><?= e($t['quote']) ?></td>
      <td><?= e($t['student_name']) ?></td>
      <td class="muted"><?= e($t['university']) ?></td>
      <td><span class="pill <?= $t['is_active']?'on':'off' ?>"><?= $t['is_active']?'Active':'Hidden' ?></span></td>
      <td><div class="actions">
        <a class="btn sm ghost" href="?edit=<?= (int)$t['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$t['id'] ?>"><button class="btn sm gray"><?= $t['is_active']?'Hide':'Show' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this testimonial?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$t['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td>
    </tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
