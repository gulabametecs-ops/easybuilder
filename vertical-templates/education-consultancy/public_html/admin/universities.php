<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Universities'; $adminActive = 'universities';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? '';
    $id  = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $name = trim($_POST['name'] ?? '');
        $desc = trim($_POST['short_desc'] ?? '');
        $full = trim($_POST['description'] ?? '');
        $loc  = trim($_POST['location'] ?? '');
        $web  = trim($_POST['website'] ?? '');
        $sort = (int)($_POST['sort_order'] ?? 0);
        $active = isset($_POST['is_active']) ? 1 : 0;
        $slug = slugify($_POST['slug'] ?? $name);
        $err = null; $logo = handle_upload('logo_file', $err);
        if ($err) flash($err, 'error');
        elseif ($name === '') flash('Name is required.', 'error');
        else {
            if ($id) {
                if (!$logo) { $logo = trim($_POST['existing_logo'] ?? ''); }
                else { delete_upload($_POST['existing_logo'] ?? ''); }
                db()->prepare('UPDATE universities SET name=?,slug=?,short_desc=?,description=?,location=?,website=?,logo=?,sort_order=?,is_active=? WHERE id=?')
                   ->execute([$name,$slug,$desc,$full,$loc,$web,$logo,$sort,$active,$id]);
                flash('University updated.');
            } else {
                db()->prepare('INSERT INTO universities (name,slug,short_desc,description,location,website,logo,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?,?)')
                   ->execute([$name,$slug,$desc,$full,$loc,$web,(string)$logo,$sort,$active]);
                flash('University added.');
            }
        }
    } elseif ($act === 'delete' && $id) {
        $st = db()->prepare('SELECT logo FROM universities WHERE id=?'); $st->execute([$id]);
        delete_upload($st->fetchColumn());
        db()->prepare('DELETE FROM universities WHERE id=?')->execute([$id]);
        flash('University deleted (and its courses).');
    } elseif ($act === 'toggle' && $id) {
        db()->prepare('UPDATE universities SET is_active=1-is_active WHERE id=?')->execute([$id]);
    }
    redirect(url('admin/universities.php'));
}

$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM universities WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT u.*, (SELECT COUNT(*) FROM courses c WHERE c.university_id=u.id) AS cc FROM universities u ORDER BY sort_order, name')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit ? 'Edit university' : 'Add a university' ?></h2>
  <form method="post" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <input type="hidden" name="action" value="save">
    <input type="hidden" name="id" value="<?= $edit ? (int)$edit['id'] : 0 ?>">
    <input type="hidden" name="existing_logo" value="<?= e($edit['logo'] ?? '') ?>">
    <div class="row2">
      <div><label>Name</label><input name="name" value="<?= e($edit['name'] ?? '') ?>" required></div>
      <div><label>URL slug <span class="help">(leave blank to auto-generate)</span></label><input name="slug" value="<?= e($edit['slug'] ?? '') ?>"></div>
    </div>
    <div class="row2">
      <div><label>Location</label><input name="location" value="<?= e($edit['location'] ?? '') ?>" placeholder="e.g. New Delhi"></div>
      <div><label>Official website</label><input name="website" value="<?= e($edit['website'] ?? '') ?>" placeholder="https://..."></div>
    </div>
    <label>Short description <span class="help">(shown on cards)</span></label>
    <input name="short_desc" value="<?= e($edit['short_desc'] ?? '') ?>">
    <label>Full description <span class="help">(shown on the university page)</span></label>
    <textarea name="description"><?= e($edit['description'] ?? '') ?></textarea>
    <div class="row2">
      <div><label>Logo image</label><input type="file" name="logo_file" accept="image/*">
        <?php if (!empty($edit['logo'])): ?><div style="margin-top:6px"><img class="thumb-sm" src="<?= e(uni_logo($edit['logo'])) ?>"></div><?php endif; ?></div>
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>">
        <label style="font-weight:normal;margin-top:10px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Visible on site</label></div>
    </div>
    <div style="margin-top:16px"><button class="btn" type="submit"><?= $edit?'Save changes':'Add university' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/universities.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>

<div class="card">
  <h2 style="margin-top:0">All universities</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Logo</th><th>Name</th><th>Location</th><th>Courses</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $u): ?>
    <tr>
      <td><?= (int)$u['sort_order'] ?></td>
      <td><img class="thumb-sm" src="<?= e(uni_logo($u['logo'])) ?>"></td>
      <td><strong><?= e($u['name']) ?></strong></td>
      <td class="muted"><?= e($u['location']) ?></td>
      <td><a href="<?= e(url('admin/courses.php?uni=' . (int)$u['id'])) ?>"><?= (int)$u['cc'] ?> courses</a></td>
      <td><span class="pill <?= $u['is_active']?'on':'off' ?>"><?= $u['is_active']?'Visible':'Hidden' ?></span></td>
      <td><div class="actions">
        <a class="btn sm ghost" href="?edit=<?= (int)$u['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$u['id'] ?>"><button class="btn sm gray"><?= $u['is_active']?'Hide':'Show' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this university and ALL its courses?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$u['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td>
    </tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
