<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'University Partners'; $adminActive = 'partners';

db()->exec("CREATE TABLE IF NOT EXISTS partners (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(150) NOT NULL, logo VARCHAR(255) DEFAULT '', link VARCHAR(255) DEFAULT '', sort_order INT DEFAULT 0, is_active TINYINT(1) DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $name = trim($_POST['name'] ?? '');
        $link = trim($_POST['link'] ?? '');
        $sort = (int)($_POST['sort_order'] ?? 0);
        $active = isset($_POST['is_active']) ? 1 : 0;
        $err = null; $logo = handle_upload('logo_file', $err);
        if ($err) flash($err, 'error');
        elseif ($name === '') flash('Name is required.', 'error');
        else {
            if ($id) {
                if (!$logo) $logo = trim($_POST['existing_logo'] ?? ''); else delete_upload($_POST['existing_logo'] ?? '');
                db()->prepare('UPDATE partners SET name=?,logo=?,link=?,sort_order=?,is_active=? WHERE id=?')->execute([$name,$logo,$link,$sort,$active,$id]);
                flash('Partner updated.');
            } else {
                db()->prepare('INSERT INTO partners (name,logo,link,sort_order,is_active) VALUES (?,?,?,?,?)')->execute([$name,(string)$logo,$link,$sort,$active]);
                flash('Partner added.');
            }
        }
    } elseif ($act === 'delete' && $id) {
        $st = db()->prepare('SELECT logo FROM partners WHERE id=?'); $st->execute([$id]); delete_upload($st->fetchColumn());
        db()->prepare('DELETE FROM partners WHERE id=?')->execute([$id]); flash('Partner deleted.');
    } elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE partners SET is_active=1-is_active WHERE id=?')->execute([$id]); }
    redirect(url('admin/partners.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM partners WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM partners ORDER BY sort_order, id')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit ? 'Edit partner' : 'Add a university partner' ?></h2>
  <p class="muted">These logos appear in the "Our University Partners" strip on the home page. Upload each partner's logo (transparent PNG works best).</p>
  <form method="post" enctype="multipart/form-data"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <input type="hidden" name="existing_logo" value="<?= e($edit['logo'] ?? '') ?>">
    <div class="row2">
      <div><label>Partner name</label><input name="name" value="<?= e($edit['name'] ?? '') ?>" placeholder="e.g. Amity University" required></div>
      <div><label>Link <span class="help">(optional — website or page URL)</span></label><input name="link" value="<?= e($edit['link'] ?? '') ?>" placeholder="https://..."></div>
    </div>
    <label>Logo image</label><input type="file" name="logo_file" accept="image/*">
    <?php if (!empty($edit['logo'])): ?><div style="margin-top:8px;background:#f2f5fb;border-radius:8px;padding:8px;display:inline-block"><img src="<?= e(uni_logo($edit['logo'])) ?>" style="height:44px"></div><?php endif; ?>
    <div class="row2">
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
      <div><label>Visible</label><label style="font-weight:normal;margin-top:2px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Show on site</label></div>
    </div>
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Add partner' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/partners.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">All partners (<?= count($rows) ?>)</h2>
  <?php if (!$rows): ?><p class="muted">No partners yet. Add your first university partner above.</p>
  <?php else: ?>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Logo</th><th>Name</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $p): ?>
    <tr>
      <td><?= (int)$p['sort_order'] ?></td>
      <td><img class="thumb-sm" src="<?= e(uni_logo($p['logo'])) ?>"></td>
      <td><strong><?= e($p['name']) ?></strong></td>
      <td><span class="pill <?= $p['is_active']?'on':'off' ?>"><?= $p['is_active']?'Visible':'Hidden' ?></span></td>
      <td><div class="actions">
        <a class="btn sm ghost" href="?edit=<?= (int)$p['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="btn sm gray"><?= $p['is_active']?'Hide':'Show' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this partner?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td>
    </tr>
    <?php endforeach; ?>
  </table></div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
