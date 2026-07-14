<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Gallery'; $adminActive = 'gallery';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $title = trim($_POST['title'] ?? ''); $cat = trim($_POST['category'] ?? '');
        $sort = (int)($_POST['sort_order'] ?? 0); $active = isset($_POST['is_active']) ? 1 : 0;
        $err = null; $img = handle_upload('image_file', $err);
        if ($err) flash($err, 'error');
        elseif (!$id && !$img) flash('Please choose an image to upload.', 'error');
        else {
            if ($id) {
                if (!$img) $img = trim($_POST['existing_image'] ?? ''); else delete_upload($_POST['existing_image'] ?? '');
                db()->prepare('UPDATE gallery SET title=?,category=?,image=?,sort_order=?,is_active=? WHERE id=?')
                   ->execute([$title,$cat,$img,$sort,$active,$id]); flash('Photo updated.');
            } else {
                db()->prepare('INSERT INTO gallery (title,category,image,sort_order,is_active) VALUES (?,?,?,?,?)')
                   ->execute([$title,$cat,$img,$sort,$active]); flash('Photo added.');
            }
        }
    } elseif ($act === 'delete' && $id) {
        $st = db()->prepare('SELECT image FROM gallery WHERE id=?'); $st->execute([$id]); delete_upload($st->fetchColumn());
        db()->prepare('DELETE FROM gallery WHERE id=?')->execute([$id]); flash('Photo deleted.');
    } elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE gallery SET is_active=1-is_active WHERE id=?')->execute([$id]); }
    redirect(url('admin/gallery.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM gallery WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM gallery ORDER BY sort_order, id')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit?'Edit photo':'Add a photo' ?></h2>
  <form method="post" enctype="multipart/form-data"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <input type="hidden" name="existing_image" value="<?= e($edit['image'] ?? '') ?>">
    <div class="row2">
      <div><label>Title / caption</label><input name="title" value="<?= e($edit['title'] ?? '') ?>"></div>
      <div><label>Category <span class="help">(optional)</span></label><input name="category" value="<?= e($edit['category'] ?? '') ?>"></div>
    </div>
    <label>Image <?= $edit?'<span class="help">(leave empty to keep current)</span>':'' ?></label>
    <input type="file" name="image_file" accept="image/*" <?= $edit?'':'required' ?>>
    <?php if (!empty($edit['image'])): ?><div style="margin-top:6px"><img class="thumb-sm" style="height:60px" src="<?= e(upload_url($edit['image'])) ?>"></div><?php endif; ?>
    <div class="row2">
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
      <div><label>Visible</label><label style="font-weight:normal;margin-top:2px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Show in gallery</label></div>
    </div>
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Add photo' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/gallery.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">Gallery (<?= count($rows) ?>)</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px">
    <?php foreach ($rows as $g): ?>
    <div style="border:1px solid var(--line);border-radius:10px;overflow:hidden">
      <img src="<?= e(upload_url($g['image'])) ?>" style="width:100%;height:110px;object-fit:cover;<?= $g['is_active']?'':'opacity:.4' ?>">
      <div style="padding:8px">
        <div style="font-size:13px"><?= e($g['title'] ?: '—') ?></div>
        <div class="actions" style="margin-top:6px">
          <a class="btn sm ghost" href="?edit=<?= (int)$g['id'] ?>">Edit</a>
          <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$g['id'] ?>"><button class="btn sm gray"><?= $g['is_active']?'Hide':'Show' ?></button></form>
          <form method="post" onsubmit="return confirm('Delete this photo?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$g['id'] ?>"><button class="btn sm red">×</button></form>
        </div>
      </div>
    </div>
    <?php endforeach; ?>
  </div>
  <?php if (!$rows): ?><p class="muted">No photos yet.</p><?php endif; ?>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
