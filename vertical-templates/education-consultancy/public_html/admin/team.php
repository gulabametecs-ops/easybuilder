<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Team'; $adminActive = 'team';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $name = trim($_POST['name'] ?? ''); $pos = trim($_POST['position'] ?? '');
        $bio = trim($_POST['bio'] ?? ''); $fb = trim($_POST['facebook'] ?? ''); $li = trim($_POST['linkedin'] ?? '');
        $sort = (int)($_POST['sort_order'] ?? 0); $active = isset($_POST['is_active']) ? 1 : 0;
        $err = null; $photo = handle_upload('photo_file', $err);
        if ($err) flash($err, 'error');
        elseif ($name === '') flash('Name is required.', 'error');
        else {
            if ($id) {
                if (!$photo) $photo = trim($_POST['existing_photo'] ?? ''); else delete_upload($_POST['existing_photo'] ?? '');
                db()->prepare('UPDATE team_members SET name=?,position=?,bio=?,facebook=?,linkedin=?,photo=?,sort_order=?,is_active=? WHERE id=?')
                   ->execute([$name,$pos,$bio,$fb,$li,$photo,$sort,$active,$id]); flash('Team member updated.');
            } else {
                db()->prepare('INSERT INTO team_members (name,position,bio,facebook,linkedin,photo,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?)')
                   ->execute([$name,$pos,$bio,$fb,$li,(string)$photo,$sort,$active]); flash('Team member added.');
            }
        }
    } elseif ($act === 'delete' && $id) {
        $st = db()->prepare('SELECT photo FROM team_members WHERE id=?'); $st->execute([$id]); delete_upload($st->fetchColumn());
        db()->prepare('DELETE FROM team_members WHERE id=?')->execute([$id]); flash('Team member deleted.');
    } elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE team_members SET is_active=1-is_active WHERE id=?')->execute([$id]); }
    redirect(url('admin/team.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM team_members WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM team_members ORDER BY sort_order, id')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit?'Edit team member':'Add a team member' ?></h2>
  <form method="post" enctype="multipart/form-data"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <input type="hidden" name="existing_photo" value="<?= e($edit['photo'] ?? '') ?>">
    <div class="row2">
      <div><label>Name</label><input name="name" value="<?= e($edit['name'] ?? '') ?>" required></div>
      <div><label>Position</label><input name="position" value="<?= e($edit['position'] ?? '') ?>"></div>
    </div>
    <label>Bio</label><textarea name="bio"><?= e($edit['bio'] ?? '') ?></textarea>
    <div class="row2">
      <div><label>Facebook URL</label><input name="facebook" value="<?= e($edit['facebook'] ?? '') ?>"></div>
      <div><label>LinkedIn URL</label><input name="linkedin" value="<?= e($edit['linkedin'] ?? '') ?>"></div>
    </div>
    <label>Photo</label><input type="file" name="photo_file" accept="image/*">
    <?php if (!empty($edit['photo'])): ?><div style="margin-top:6px"><img class="thumb-sm" src="<?= e(upload_url($edit['photo'])) ?>"></div><?php endif; ?>
    <div class="row2">
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
      <div><label>Visible</label><label style="font-weight:normal;margin-top:2px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Show on site</label></div>
    </div>
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Add member' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/team.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">Team members</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Photo</th><th>Name</th><th>Position</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $m): ?>
    <tr><td><?= (int)$m['sort_order'] ?></td><td><img class="thumb-sm" style="border-radius:50%" src="<?= e(upload_url($m['photo'])) ?>"></td>
      <td><strong><?= e($m['name']) ?></strong></td><td class="muted"><?= e($m['position']) ?></td>
      <td><span class="pill <?= $m['is_active']?'on':'off' ?>"><?= $m['is_active']?'Live':'Hidden' ?></span></td>
      <td><div class="actions"><a class="btn sm ghost" href="?edit=<?= (int)$m['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$m['id'] ?>"><button class="btn sm gray"><?= $m['is_active']?'Hide':'Show' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this member?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$m['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td></tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
