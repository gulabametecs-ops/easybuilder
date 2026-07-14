<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Newsletter'; $adminActive = 'newsletter';

if (($_GET['export'] ?? '') === 'csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="newsletter_' . date('Ymd_His') . '.csv"');
    $out = fopen('php://output', 'w'); fprintf($out, "\xEF\xBB\xBF"); fputcsv($out, ['Email','Subscribed on']);
    foreach (db()->query('SELECT email, created_at FROM newsletter ORDER BY created_at DESC') as $r) fputcsv($out, [$r['email'], $r['created_at']]);
    fclose($out); exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check() && ($_POST['action'] ?? '') === 'delete') {
    db()->prepare('DELETE FROM newsletter WHERE id=?')->execute([(int)($_POST['id'] ?? 0)]);
    flash('Subscriber removed.'); redirect(url('admin/newsletter.php'));
}
$rows = db()->query('SELECT * FROM newsletter ORDER BY created_at DESC')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <div class="toolbar"><h2 style="margin:0;flex:1">Newsletter subscribers (<?= count($rows) ?>)</h2>
    <?php if ($rows): ?><a class="btn green" href="?export=csv">Export CSV</a><?php endif; ?></div>
  <?php if (!$rows): ?><p class="muted">No subscribers yet. The subscribe box is in the website footer.</p>
  <?php else: ?>
  <div style="overflow-x:auto"><table>
    <tr><th>Email</th><th>Subscribed</th><th></th></tr>
    <?php foreach ($rows as $r): ?>
    <tr><td><?= e($r['email']) ?></td><td class="muted"><?= e(date('d M Y H:i', strtotime($r['created_at']))) ?></td>
      <td><form method="post" onsubmit="return confirm('Remove this subscriber?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$r['id'] ?>"><button class="btn sm red">Remove</button></form></td></tr>
    <?php endforeach; ?>
  </table></div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
