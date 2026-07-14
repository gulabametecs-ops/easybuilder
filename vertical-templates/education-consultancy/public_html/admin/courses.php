<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Courses'; $adminActive = 'courses';

$unis = db()->query('SELECT id,name FROM universities ORDER BY sort_order,name')->fetchAll();
$uniName = []; foreach ($unis as $u) $uniName[$u['id']] = $u['name'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $uid = (int)($_POST['university_id'] ?? 0);
        $title = trim($_POST['title'] ?? '');
        $level = trim($_POST['level'] ?? '');
        $dur = trim($_POST['duration'] ?? '');
        $fees = trim($_POST['fees'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        $sort = (int)($_POST['sort_order'] ?? 0);
        $active = isset($_POST['is_active']) ? 1 : 0;
        if ($title === '' || !isset($uniName[$uid])) flash('Please choose a university and enter a title.', 'error');
        elseif ($id) {
            db()->prepare('UPDATE courses SET university_id=?,title=?,level=?,duration=?,fees=?,description=?,sort_order=?,is_active=? WHERE id=?')
               ->execute([$uid,$title,$level,$dur,$fees,$desc,$sort,$active,$id]);
            flash('Course updated.');
        } else {
            db()->prepare('INSERT INTO courses (university_id,title,level,duration,fees,description,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?)')
               ->execute([$uid,$title,$level,$dur,$fees,$desc,$sort,$active]);
            flash('Course added.');
        }
    } elseif ($act === 'delete' && $id) { db()->prepare('DELETE FROM courses WHERE id=?')->execute([$id]); flash('Course deleted.'); }
    elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE courses SET is_active=1-is_active WHERE id=?')->execute([$id]); }
    $back = url('admin/courses.php'); if (!empty($_POST['filter_uni'])) $back .= '?uni=' . (int)$_POST['filter_uni'];
    redirect($back);
}

$filterUni = (int)($_GET['uni'] ?? 0);
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM courses WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$sql = 'SELECT * FROM courses'; $params = [];
if ($filterUni) { $sql .= ' WHERE university_id=?'; $params[] = $filterUni; }
$sql .= ' ORDER BY university_id, sort_order, title';
$st = db()->prepare($sql); $st->execute($params); $rows = $st->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit ? 'Edit course' : 'Add a course' ?></h2>
  <?php if (!$unis): ?><p class="muted">Add a university first.</p><?php else: ?>
  <form method="post">
    <?= csrf_field() ?>
    <input type="hidden" name="action" value="save">
    <input type="hidden" name="id" value="<?= $edit ? (int)$edit['id'] : 0 ?>">
    <input type="hidden" name="filter_uni" value="<?= $filterUni ?>">
    <div class="row2">
      <div><label>University</label><select name="university_id" required>
        <?php foreach ($unis as $u): ?><option value="<?= (int)$u['id'] ?>" <?= ($edit?$edit['university_id']==$u['id']:$u['id']==$filterUni)?'selected':'' ?>><?= e($u['name']) ?></option><?php endforeach; ?>
      </select></div>
      <div><label>Course title</label><input name="title" value="<?= e($edit['title'] ?? '') ?>" required></div>
    </div>
    <div class="row2">
      <div><label>Level <span class="help">(e.g. UG, PG, Diploma)</span></label><input name="level" value="<?= e($edit['level'] ?? '') ?>"></div>
      <div><label>Duration <span class="help">(e.g. 3 Years)</span></label><input name="duration" value="<?= e($edit['duration'] ?? '') ?>"></div>
    </div>
    <div class="row2">
      <div><label>Fees <span class="help">(optional)</span></label><input name="fees" value="<?= e($edit['fees'] ?? '') ?>"></div>
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
    </div>
    <label>Description <span class="help">(optional)</span></label>
    <textarea name="description"><?= e($edit['description'] ?? '') ?></textarea>
    <label style="font-weight:normal;margin-top:10px"><input type="checkbox" name="is_active" style="width:auto" <?= (!$edit || $edit['is_active'])?'checked':'' ?>> Show on website</label>
    <div style="margin-top:16px"><button class="btn" type="submit"><?= $edit?'Save changes':'Add course' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/courses.php')) ?>">Cancel</a><?php endif; ?></div>
  </form>
  <?php endif; ?>
</div>

<div class="card">
  <form method="get" class="toolbar">
    <label style="margin:0">Filter:</label>
    <select name="uni" style="width:auto" onchange="this.form.submit()">
      <option value="0">All universities</option>
      <?php foreach ($unis as $u): ?><option value="<?= (int)$u['id'] ?>" <?= $filterUni==$u['id']?'selected':'' ?>><?= e($u['name']) ?></option><?php endforeach; ?>
    </select>
    <span class="muted"><?= count($rows) ?> courses</span>
  </form>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Title</th><th>University</th><th>Level</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $c): ?>
    <tr>
      <td><?= (int)$c['sort_order'] ?></td>
      <td><?= e($c['title']) ?></td>
      <td class="muted"><?= e($uniName[$c['university_id']] ?? '—') ?></td>
      <td class="muted"><?= e(trim($c['level'].' '.$c['duration'])) ?></td>
      <td><span class="pill <?= $c['is_active']?'on':'off' ?>"><?= $c['is_active']?'Live':'Hidden' ?></span></td>
      <td><div class="actions">
        <a class="btn sm ghost" href="?edit=<?= (int)$c['id'] ?><?= $filterUni?'&uni='.$filterUni:'' ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$c['id'] ?>"><input type="hidden" name="filter_uni" value="<?= $filterUni ?>"><button class="btn sm gray"><?= $c['is_active']?'Hide':'Show' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this course?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$c['id'] ?>"><input type="hidden" name="filter_uni" value="<?= $filterUni ?>"><button class="btn sm red">Delete</button></form>
      </div></td>
    </tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
