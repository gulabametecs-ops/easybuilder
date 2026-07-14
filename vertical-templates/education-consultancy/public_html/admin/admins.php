<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Admin Users'; $adminActive = 'admins';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? '';
    if ($act === 'add') {
        $u = trim($_POST['username'] ?? ''); $p = $_POST['password'] ?? ''; $name = trim($_POST['full_name'] ?? '');
        $exists = db()->prepare('SELECT id FROM admins WHERE username=?'); $exists->execute([$u]);
        if (strlen($u) < 3) flash('Username must be at least 3 characters.', 'error');
        elseif (strlen($p) < 6) flash('Password must be at least 6 characters.', 'error');
        elseif ($exists->fetch()) flash('That username already exists.', 'error');
        else { db()->prepare('INSERT INTO admins (username,password_hash,full_name) VALUES (?,?,?)')
                 ->execute([$u, password_hash($p, PASSWORD_DEFAULT), $name]); flash('Admin user created.'); }
    } elseif ($act === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id === (int)$_SESSION['admin_id']) flash('You cannot delete your own account while logged in.', 'error');
        elseif ((int)db()->query('SELECT COUNT(*) FROM admins')->fetchColumn() <= 1) flash('At least one admin must remain.', 'error');
        else { db()->prepare('DELETE FROM admins WHERE id=?')->execute([$id]); flash('Admin user deleted.'); }
    } elseif ($act === 'reset') {
        $id = (int)($_POST['id'] ?? 0); $p = $_POST['password'] ?? '';
        if (strlen($p) < 6) flash('Password must be at least 6 characters.', 'error');
        else { db()->prepare('UPDATE admins SET password_hash=? WHERE id=?')->execute([password_hash($p, PASSWORD_DEFAULT), $id]); flash('Password reset.'); }
    }
    redirect(url('admin/admins.php'));
}
$rows = db()->query('SELECT id, username, full_name, created_at FROM admins ORDER BY id')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0">Add an admin user</h2>
  <form method="post"><?= csrf_field() ?>
    <input type="hidden" name="action" value="add">
    <div class="row2">
      <div><label>Username</label><input name="username" required></div>
      <div><label>Full name</label><input name="full_name"></div>
    </div>
    <label>Password</label><input type="password" name="password" required>
    <div style="margin-top:16px"><button class="btn">Create admin</button></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">Admin users</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Username</th><th>Name</th><th>Created</th><th>Reset password</th><th></th></tr>
    <?php foreach ($rows as $a): ?>
    <tr>
      <td><strong><?= e($a['username']) ?></strong><?= $a['id']==$_SESSION['admin_id']?' <span class="muted">(you)</span>':'' ?></td>
      <td class="muted"><?= e($a['full_name']) ?></td>
      <td class="muted"><?= e(date('d M Y', strtotime($a['created_at']))) ?></td>
      <td><form method="post" style="display:flex;gap:6px"><?= csrf_field() ?><input type="hidden" name="action" value="reset"><input type="hidden" name="id" value="<?= (int)$a['id'] ?>">
        <input type="password" name="password" placeholder="new password" style="width:150px"><button class="btn sm gray">Set</button></form></td>
      <td><?php if ($a['id'] != $_SESSION['admin_id']): ?>
        <form method="post" onsubmit="return confirm('Delete this admin user?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$a['id'] ?>"><button class="btn sm red">Delete</button></form>
      <?php endif; ?></td>
    </tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
