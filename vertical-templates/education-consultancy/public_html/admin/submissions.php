<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Submissions'; $adminActive = 'submissions';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $id = (int)($_POST['id'] ?? 0);
    $act = $_POST['action'] ?? '';
    if ($id && $act === 'delete') {
        db()->prepare('DELETE FROM submissions WHERE id=?')->execute([$id]);
        flash('Submission deleted.');
    } elseif ($id && $act === 'toggle_read') {
        db()->prepare('UPDATE submissions SET is_read = 1 - is_read WHERE id=?')->execute([$id]);
    }
    redirect(url('admin/submissions.php') . '?' . http_build_query(array_filter([
        'type' => $_POST['f_type'] ?? '', 'q' => $_POST['f_q'] ?? ''
    ])));
}

$type = $_GET['type'] ?? '';
$q    = trim($_GET['q'] ?? '');
$where = []; $params = [];
if (in_array($type, ['consultation','application','contact'], true)) { $where[] = 'type = ?'; $params[] = $type; }
if ($q !== '') { $where[] = '(name LIKE ? OR email LIKE ? OR mobile LIKE ? OR course LIKE ? OR message LIKE ?)';
    array_push($params, "%$q%", "%$q%", "%$q%", "%$q%", "%$q%"); }
$sql = 'SELECT * FROM submissions' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY created_at DESC LIMIT 500';
$stmt = db()->prepare($sql); $stmt->execute($params);
$rows = $stmt->fetchAll();

include __DIR__ . '/partials/head.php';
$exportQs = http_build_query(array_filter(['type'=>$type,'q'=>$q]));
?>
<div class="card">
  <form method="get" class="toolbar">
    <select name="type" style="width:auto">
      <option value="">All types</option>
      <option value="consultation" <?= $type==='consultation'?'selected':'' ?>>Consultation</option>
      <option value="application"  <?= $type==='application'?'selected':'' ?>>Application</option>
      <option value="contact"      <?= $type==='contact'?'selected':'' ?>>Contact</option>
    </select>
    <input class="grow" type="text" name="q" value="<?= e($q) ?>" placeholder="Search name, email, mobile, course, message...">
    <button class="btn" type="submit">Filter</button>
    <a class="btn gray" href="<?= e(url('admin/submissions.php')) ?>">Reset</a>
    <a class="btn green" href="<?= e(url('admin/export.php')) ?><?= $exportQs?('?'.$exportQs):'' ?>">Export CSV</a>
  </form>

  <p class="muted"><?= count($rows) ?> result<?= count($rows)===1?'':'s' ?><?= count($rows)>=500?' (showing latest 500)':'' ?>.</p>

  <?php if (!$rows): ?>
    <p class="muted">No submissions match.</p>
  <?php else: ?>
  <div style="overflow-x:auto">
  <table>
    <tr><th>Date</th><th>Type</th><th>Name</th><th>Mobile</th><th>Email</th><th>Details</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $s): ?>
    <tr style="<?= $s['is_read']?'':'background:#fffbe9' ?>">
      <td class="muted" style="white-space:nowrap"><?= e(date('d M Y H:i', strtotime($s['created_at']))) ?></td>
      <td><span class="pill <?= e($s['type']) ?>"><?= e($s['type']) ?></span></td>
      <td><?= e($s['name']) ?: '—' ?></td>
      <td style="white-space:nowrap"><?= e($s['mobile']) ?: '—' ?></td>
      <td><?= e($s['email']) ?: '—' ?></td>
      <td style="max-width:260px">
        <?php if ($s['course']): ?><div><strong>Course:</strong> <?= e($s['course']) ?></div><?php endif; ?>
        <?php if ($s['university']): ?><div><strong>University:</strong> <?= e($s['university']) ?></div><?php endif; ?>
        <?php if ($s['dob']): ?><div class="muted">DOB: <?= e($s['dob']) ?></div><?php endif; ?>
        <?php if ($s['message']): ?><div><?= nl2br(e($s['message'])) ?></div><?php endif; ?>
      </td>
      <td><span class="pill <?= $s['is_read']?'off':'on' ?>"><?= $s['is_read']?'Read':'New' ?></span></td>
      <td>
        <div class="actions">
          <form method="post"><?= csrf_field() ?>
            <input type="hidden" name="id" value="<?= (int)$s['id'] ?>">
            <input type="hidden" name="action" value="toggle_read">
            <input type="hidden" name="f_type" value="<?= e($type) ?>"><input type="hidden" name="f_q" value="<?= e($q) ?>">
            <button class="btn sm ghost"><?= $s['is_read']?'Mark new':'Mark read' ?></button>
          </form>
          <form method="post" onsubmit="return confirm('Delete this submission?')"><?= csrf_field() ?>
            <input type="hidden" name="id" value="<?= (int)$s['id'] ?>">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="f_type" value="<?= e($type) ?>"><input type="hidden" name="f_q" value="<?= e($q) ?>">
            <button class="btn sm red">Delete</button>
          </form>
        </div>
      </td>
    </tr>
    <?php endforeach; ?>
  </table>
  </div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
