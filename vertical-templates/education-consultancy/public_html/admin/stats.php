<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Stats / Counters'; $adminActive = 'stats';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $label = trim($_POST['label'] ?? ''); $value = trim($_POST['value'] ?? '');
        $suffix = trim($_POST['suffix'] ?? ''); $icon = trim($_POST['icon'] ?? ''); $sort = (int)($_POST['sort_order'] ?? 0);
        if ($label === '' || $value === '') flash('Label and value are required.', 'error');
        elseif ($id) { db()->prepare('UPDATE stats SET label=?,value=?,suffix=?,icon=?,sort_order=? WHERE id=?')->execute([$label,$value,$suffix,$icon,$sort,$id]); flash('Stat updated.'); }
        else { db()->prepare('INSERT INTO stats (label,value,suffix,icon,sort_order) VALUES (?,?,?,?,?)')->execute([$label,$value,$suffix,$icon,$sort]); flash('Stat added.'); }
    } elseif ($act === 'delete' && $id) { db()->prepare('DELETE FROM stats WHERE id=?')->execute([$id]); flash('Stat deleted.'); }
    redirect(url('admin/stats.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM stats WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM stats ORDER BY sort_order, id')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit?'Edit stat':'Add a stat' ?></h2>
  <p class="muted">These are the animated counters shown on the home and about pages (e.g. "2000+ Happy Students").</p>
  <form method="post"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <div class="row2">
      <div><label>Label</label><input name="label" value="<?= e($edit['label'] ?? '') ?>" placeholder="Happy Students" required></div>
      <div><label>Icon <span class="help">(emoji)</span></label><input name="icon" value="<?= e($edit['icon'] ?? '') ?>" placeholder="🎓"></div>
    </div>
    <div class="row2">
      <div><label>Value <span class="help">(number, e.g. 2000)</span></label><input name="value" value="<?= e($edit['value'] ?? '') ?>" required></div>
      <div><label>Suffix <span class="help">(e.g. +)</span></label><input name="suffix" value="<?= e($edit['suffix'] ?? '') ?>"></div>
    </div>
    <label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>">
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Add stat' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/stats.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">All stats</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Icon</th><th>Value</th><th>Label</th><th>Actions</th></tr>
    <?php foreach ($rows as $s): ?>
    <tr><td><?= (int)$s['sort_order'] ?></td><td style="font-size:20px"><?= e($s['icon']) ?></td>
      <td><strong><?= e($s['value'].$s['suffix']) ?></strong></td><td><?= e($s['label']) ?></td>
      <td><div class="actions"><a class="btn sm ghost" href="?edit=<?= (int)$s['id'] ?>">Edit</a>
        <form method="post" onsubmit="return confirm('Delete this stat?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$s['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td></tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
