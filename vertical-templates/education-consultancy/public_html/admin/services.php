<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Services'; $adminActive = 'services';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $title = trim($_POST['title'] ?? '');
        $icon  = trim($_POST['icon'] ?? '');
        $short = trim($_POST['short_desc'] ?? '');
        $desc  = trim($_POST['description'] ?? '');
        $sort  = (int)($_POST['sort_order'] ?? 0);
        $active = isset($_POST['is_active']) ? 1 : 0;
        if ($title === '') flash('Title is required.', 'error');
        elseif ($id) {
            db()->prepare('UPDATE services SET title=?,slug=?,icon=?,short_desc=?,description=?,sort_order=?,is_active=? WHERE id=?')
               ->execute([$title,slugify($title),$icon,$short,$desc,$sort,$active,$id]); flash('Service updated.');
        } else {
            db()->prepare('INSERT INTO services (title,slug,icon,short_desc,description,sort_order,is_active) VALUES (?,?,?,?,?,?,?)')
               ->execute([$title,slugify($title),$icon,$short,$desc,$sort,$active]); flash('Service added.');
        }
    } elseif ($act === 'delete' && $id) { db()->prepare('DELETE FROM services WHERE id=?')->execute([$id]); flash('Service deleted.'); }
    elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE services SET is_active=1-is_active WHERE id=?')->execute([$id]); }
    redirect(url('admin/services.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM services WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM services ORDER BY sort_order, id')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit?'Edit service':'Add a service' ?></h2>
  <form method="post"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <div class="row2">
      <div><label>Title</label><input name="title" value="<?= e($edit['title'] ?? '') ?>" required></div>
      <div><label>Icon <span class="help">(an emoji, e.g. 🎓 📝 🚀)</span></label><input name="icon" value="<?= e($edit['icon'] ?? '') ?>"></div>
    </div>
    <label>Short description</label><input name="short_desc" value="<?= e($edit['short_desc'] ?? '') ?>">
    <label>Full description <span class="help">(optional)</span></label><textarea name="description"><?= e($edit['description'] ?? '') ?></textarea>
    <div class="row2">
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
      <div><label>Visible</label><label style="font-weight:normal;margin-top:2px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Show on site</label></div>
    </div>
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Add service' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/services.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">All services</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Icon</th><th>Title</th><th>Description</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $s): ?>
    <tr><td><?= (int)$s['sort_order'] ?></td><td style="font-size:22px"><?= e($s['icon']) ?></td>
      <td><strong><?= e($s['title']) ?></strong></td><td class="muted"><?= e($s['short_desc']) ?></td>
      <td><span class="pill <?= $s['is_active']?'on':'off' ?>"><?= $s['is_active']?'Live':'Hidden' ?></span></td>
      <td><div class="actions">
        <a class="btn sm ghost" href="?edit=<?= (int)$s['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$s['id'] ?>"><button class="btn sm gray"><?= $s['is_active']?'Hide':'Show' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this service?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$s['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td></tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
