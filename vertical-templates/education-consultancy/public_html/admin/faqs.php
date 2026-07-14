<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'FAQs'; $adminActive = 'faqs';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $q = trim($_POST['question'] ?? ''); $a = trim($_POST['answer'] ?? '');
        $sort = (int)($_POST['sort_order'] ?? 0); $active = isset($_POST['is_active']) ? 1 : 0;
        if ($q === '') flash('Question is required.', 'error');
        elseif ($id) { db()->prepare('UPDATE faqs SET question=?,answer=?,sort_order=?,is_active=? WHERE id=?')->execute([$q,$a,$sort,$active,$id]); flash('FAQ updated.'); }
        else { db()->prepare('INSERT INTO faqs (question,answer,sort_order,is_active) VALUES (?,?,?,?)')->execute([$q,$a,$sort,$active]); flash('FAQ added.'); }
    } elseif ($act === 'delete' && $id) { db()->prepare('DELETE FROM faqs WHERE id=?')->execute([$id]); flash('FAQ deleted.'); }
    elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE faqs SET is_active=1-is_active WHERE id=?')->execute([$id]); }
    redirect(url('admin/faqs.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM faqs WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM faqs ORDER BY sort_order, id')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit?'Edit FAQ':'Add a FAQ' ?></h2>
  <form method="post"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <label>Question</label><input name="question" value="<?= e($edit['question'] ?? '') ?>" required>
    <label>Answer</label><textarea name="answer"><?= e($edit['answer'] ?? '') ?></textarea>
    <div class="row2">
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
      <div><label>Visible</label><label style="font-weight:normal;margin-top:2px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Show on site</label></div>
    </div>
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Add FAQ' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/faqs.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">All FAQs</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Question</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $f): ?>
    <tr><td><?= (int)$f['sort_order'] ?></td><td><strong><?= e($f['question']) ?></strong><br><span class="muted"><?= e(excerpt($f['answer'],90)) ?></span></td>
      <td><span class="pill <?= $f['is_active']?'on':'off' ?>"><?= $f['is_active']?'Live':'Hidden' ?></span></td>
      <td><div class="actions">
        <a class="btn sm ghost" href="?edit=<?= (int)$f['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$f['id'] ?>"><button class="btn sm gray"><?= $f['is_active']?'Hide':'Show' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this FAQ?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$f['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td></tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
