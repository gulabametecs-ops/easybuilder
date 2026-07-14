<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Events'; $adminActive = 'events';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $title = trim($_POST['title'] ?? ''); $desc = trim($_POST['description'] ?? '');
        $date = trim($_POST['event_date'] ?? '') ?: null; $loc = trim($_POST['location'] ?? '');
        $sort = (int)($_POST['sort_order'] ?? 0); $active = isset($_POST['is_active']) ? 1 : 0;
        $err = null; $img = handle_upload('image_file', $err);
        if ($err) flash($err, 'error');
        elseif ($title === '') flash('Title is required.', 'error');
        else {
            if ($id) {
                if (!$img) $img = trim($_POST['existing_image'] ?? ''); else delete_upload($_POST['existing_image'] ?? '');
                db()->prepare('UPDATE events SET title=?,description=?,image=?,event_date=?,location=?,sort_order=?,is_active=? WHERE id=?')
                   ->execute([$title,$desc,$img,$date,$loc,$sort,$active,$id]); flash('Event updated.');
            } else {
                db()->prepare('INSERT INTO events (title,description,image,event_date,location,sort_order,is_active) VALUES (?,?,?,?,?,?,?)')
                   ->execute([$title,$desc,(string)$img,$date,$loc,$sort,$active]); flash('Event added.');
            }
        }
    } elseif ($act === 'delete' && $id) {
        $st = db()->prepare('SELECT image FROM events WHERE id=?'); $st->execute([$id]); delete_upload($st->fetchColumn());
        db()->prepare('DELETE FROM events WHERE id=?')->execute([$id]); flash('Event deleted.');
    } elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE events SET is_active=1-is_active WHERE id=?')->execute([$id]); }
    redirect(url('admin/events.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM events WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM events ORDER BY event_date DESC, id DESC')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit?'Edit event':'Add an event' ?></h2>
  <form method="post" enctype="multipart/form-data"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <input type="hidden" name="existing_image" value="<?= e($edit['image'] ?? '') ?>">
    <label>Title</label><input name="title" value="<?= e($edit['title'] ?? '') ?>" required>
    <label>Description</label><textarea name="description"><?= e($edit['description'] ?? '') ?></textarea>
    <div class="row2">
      <div><label>Date</label><input type="date" name="event_date" value="<?= e($edit['event_date'] ?? '') ?>"></div>
      <div><label>Location</label><input name="location" value="<?= e($edit['location'] ?? '') ?>"></div>
    </div>
    <label>Image <span class="help">(optional)</span></label><input type="file" name="image_file" accept="image/*">
    <?php if (!empty($edit['image'])): ?><div style="margin-top:6px"><img class="thumb-sm" style="height:60px" src="<?= e(upload_url($edit['image'])) ?>"></div><?php endif; ?>
    <div class="row2">
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
      <div><label>Visible</label><label style="font-weight:normal;margin-top:2px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Show on site</label></div>
    </div>
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Add event' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/events.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">All events</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Date</th><th>Title</th><th>Location</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $ev): ?>
    <tr><td class="muted" style="white-space:nowrap"><?= $ev['event_date']?e(date('d M Y', strtotime($ev['event_date']))):'TBA' ?></td>
      <td><strong><?= e($ev['title']) ?></strong></td><td class="muted"><?= e($ev['location']) ?></td>
      <td><span class="pill <?= $ev['is_active']?'on':'off' ?>"><?= $ev['is_active']?'Live':'Hidden' ?></span></td>
      <td><div class="actions"><a class="btn sm ghost" href="?edit=<?= (int)$ev['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$ev['id'] ?>"><button class="btn sm gray"><?= $ev['is_active']?'Hide':'Show' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this event?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$ev['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td></tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
