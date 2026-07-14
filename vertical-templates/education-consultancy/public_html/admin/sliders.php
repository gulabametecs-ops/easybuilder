<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Home Sliders'; $adminActive = 'sliders';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $title = trim($_POST['title'] ?? ''); $sub = trim($_POST['subtitle'] ?? '');
        $bt = trim($_POST['button_text'] ?? ''); $bl = trim($_POST['button_link'] ?? '');
        $sort = (int)($_POST['sort_order'] ?? 0); $active = isset($_POST['is_active']) ? 1 : 0;
        $err = null; $img = handle_upload('image_file', $err);
        if ($err) flash($err, 'error');
        else {
            if ($id) {
                if (!$img) $img = trim($_POST['existing_image'] ?? ''); else delete_upload($_POST['existing_image'] ?? '');
                db()->prepare('UPDATE sliders SET title=?,subtitle=?,image=?,button_text=?,button_link=?,sort_order=?,is_active=? WHERE id=?')
                   ->execute([$title,$sub,$img,$bt,$bl,$sort,$active,$id]); flash('Slide updated.');
            } else {
                db()->prepare('INSERT INTO sliders (title,subtitle,image,button_text,button_link,sort_order,is_active) VALUES (?,?,?,?,?,?,?)')
                   ->execute([$title,$sub,(string)$img,$bt,$bl,$sort,$active]); flash('Slide added.');
            }
        }
    } elseif ($act === 'delete' && $id) {
        $st = db()->prepare('SELECT image FROM sliders WHERE id=?'); $st->execute([$id]); delete_upload($st->fetchColumn());
        db()->prepare('DELETE FROM sliders WHERE id=?')->execute([$id]); flash('Slide deleted.');
    } elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE sliders SET is_active=1-is_active WHERE id=?')->execute([$id]); }
    redirect(url('admin/sliders.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM sliders WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM sliders ORDER BY sort_order, id')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit?'Edit slide':'Add a slide' ?></h2>
  <p class="muted">These are the big rotating banners at the top of the home page. Tip: use <code>#consult</code> as the button link to open the free-consultation popup, or a page like <code>courses.php</code>.</p>
  <form method="post" enctype="multipart/form-data"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <input type="hidden" name="existing_image" value="<?= e($edit['image'] ?? '') ?>">
    <label>Title</label><input name="title" value="<?= e($edit['title'] ?? '') ?>">
    <label>Subtitle</label><input name="subtitle" value="<?= e($edit['subtitle'] ?? '') ?>">
    <div class="row2">
      <div><label>Button text</label><input name="button_text" value="<?= e($edit['button_text'] ?? '') ?>"></div>
      <div><label>Button link</label><input name="button_link" value="<?= e($edit['button_link'] ?? '') ?>" placeholder="#consult or courses.php"></div>
    </div>
    <label>Background image <span class="help">(wide image works best; optional — a gradient is used if empty)</span></label>
    <input type="file" name="image_file" accept="image/*">
    <?php if (!empty($edit['image'])): ?><div style="margin-top:6px"><img class="thumb-sm" style="height:60px" src="<?= e(upload_url($edit['image'])) ?>"></div><?php endif; ?>
    <div class="row2">
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
      <div><label>Visible</label><label style="font-weight:normal;margin-top:2px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Show slide</label></div>
    </div>
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Add slide' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/sliders.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">All slides</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Image</th><th>Title</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $s): ?>
    <tr><td><?= (int)$s['sort_order'] ?></td><td><?php if($s['image']):?><img class="thumb-sm" style="height:44px" src="<?= e(upload_url($s['image'])) ?>"><?php else:?><span class="muted">gradient</span><?php endif;?></td>
      <td><strong><?= e($s['title']) ?></strong><br><span class="muted"><?= e($s['subtitle']) ?></span></td>
      <td><span class="pill <?= $s['is_active']?'on':'off' ?>"><?= $s['is_active']?'Live':'Hidden' ?></span></td>
      <td><div class="actions"><a class="btn sm ghost" href="?edit=<?= (int)$s['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$s['id'] ?>"><button class="btn sm gray"><?= $s['is_active']?'Hide':'Show' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this slide?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$s['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td></tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
