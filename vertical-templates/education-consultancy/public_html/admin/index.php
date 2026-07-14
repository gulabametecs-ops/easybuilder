<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Dashboard'; $adminActive = 'dashboard';

function cnt(string $sql): int { try { return (int)db()->query($sql)->fetchColumn(); } catch (Throwable $e) { return 0; } }
$c = [
    'total'   => cnt('SELECT COUNT(*) FROM submissions'),
    'unread'  => cnt('SELECT COUNT(*) FROM submissions WHERE is_read=0'),
    'consult' => cnt("SELECT COUNT(*) FROM submissions WHERE type='consultation'"),
    'apply'   => cnt("SELECT COUNT(*) FROM submissions WHERE type='application'"),
    'contact' => cnt("SELECT COUNT(*) FROM submissions WHERE type='contact'"),
    'news'    => cnt('SELECT COUNT(*) FROM newsletter'),
    'unis'    => cnt('SELECT COUNT(*) FROM universities'),
    'courses' => cnt('SELECT COUNT(*) FROM courses'),
    'blog'    => cnt('SELECT COUNT(*) FROM blog_posts'),
    'events'  => cnt('SELECT COUNT(*) FROM events'),
];
$recent = db()->query('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 8')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="grid-stats">
  <div class="stat"><div class="n"><?= $c['total'] ?></div><div class="l">Total leads</div></div>
  <div class="stat"><div class="n" style="color:#c0392b"><?= $c['unread'] ?></div><div class="l">Unread leads</div></div>
  <div class="stat"><div class="n"><?= $c['consult'] ?></div><div class="l">Consultations</div></div>
  <div class="stat"><div class="n"><?= $c['apply'] ?></div><div class="l">Applications</div></div>
  <div class="stat"><div class="n"><?= $c['contact'] ?></div><div class="l">Contact messages</div></div>
  <div class="stat"><div class="n"><?= $c['news'] ?></div><div class="l">Newsletter subs</div></div>
  <div class="stat"><div class="n"><?= $c['courses'] ?></div><div class="l">Courses</div></div>
  <div class="stat"><div class="n"><?= $c['blog'] ?></div><div class="l">Blog posts</div></div>
</div>

<div class="card">
  <div class="toolbar"><h2 style="margin:0;flex:1">Recent leads</h2>
    <a class="btn ghost sm" href="<?= e(url('admin/submissions.php')) ?>">View all</a></div>
  <?php if (!$recent): ?>
    <p class="muted">No submissions yet. They'll appear here as visitors use the forms.</p>
  <?php else: ?>
  <div style="overflow-x:auto"><table>
    <tr><th>Date</th><th>Type</th><th>Name</th><th>Contact</th><th>Course / Message</th></tr>
    <?php foreach ($recent as $s): ?>
    <tr style="<?= $s['is_read']?'':'background:#fffbe9' ?>">
      <td class="muted" style="white-space:nowrap"><?= e(date('d M, H:i', strtotime($s['created_at']))) ?></td>
      <td><span class="pill <?= e($s['type']) ?>"><?= e($s['type']) ?></span></td>
      <td><?= e($s['name']) ?: '—' ?></td>
      <td><?= e($s['mobile']) ?><?= $s['mobile']&&$s['email']?'<br>':'' ?><span class="muted"><?= e($s['email']) ?></span></td>
      <td><?= e($s['course'] ?: $s['message'] ?: $s['university']) ?></td>
    </tr>
    <?php endforeach; ?>
  </table></div>
  <?php endif; ?>
</div>

<div class="card">
  <h2 style="margin-top:0">Quick actions</h2>
  <div class="actions">
    <a class="btn" href="<?= e(url('admin/courses.php')) ?>">+ Add course</a>
    <a class="btn" href="<?= e(url('admin/blog.php')) ?>">+ Write blog post</a>
    <a class="btn" href="<?= e(url('admin/events.php')) ?>">+ Add event</a>
    <a class="btn" href="<?= e(url('admin/gallery.php')) ?>">+ Upload photo</a>
    <a class="btn ghost" href="<?= e(url('admin/settings.php')) ?>">Edit site settings</a>
  </div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
