<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Pages'; $adminActive = 'pages';

// ensure table exists (for installs upgraded without re-running installer)
db()->exec("CREATE TABLE IF NOT EXISTS pages (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200) NOT NULL, slug VARCHAR(220) UNIQUE, content MEDIUMTEXT, hero_subtitle VARCHAR(300) DEFAULT '', is_published TINYINT(1) DEFAULT 1, show_in_menu TINYINT(1) DEFAULT 0, sort_order INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $title = trim($_POST['title'] ?? '');
        $sub = trim($_POST['hero_subtitle'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $pub = isset($_POST['is_published']) ? 1 : 0;
        $menu = isset($_POST['show_in_menu']) ? 1 : 0;
        $sort = (int)($_POST['sort_order'] ?? 0);
        $slug = slugify($_POST['slug'] ?? $title);
        $chk = db()->prepare('SELECT id FROM pages WHERE slug=? AND id<>?'); $chk->execute([$slug, $id]);
        if ($chk->fetch()) $slug .= '-' . substr(md5($title . microtime()), 0, 4);
        if ($title === '') flash('Title is required.', 'error');
        elseif ($id) {
            db()->prepare('UPDATE pages SET title=?,slug=?,hero_subtitle=?,content=?,is_published=?,show_in_menu=?,sort_order=? WHERE id=?')
               ->execute([$title,$slug,$sub,$content,$pub,$menu,$sort,$id]); flash('Page updated.');
        } else {
            db()->prepare('INSERT INTO pages (title,slug,hero_subtitle,content,is_published,show_in_menu,sort_order) VALUES (?,?,?,?,?,?,?)')
               ->execute([$title,$slug,$sub,$content,$pub,$menu,$sort]); flash('Page created.');
        }
    } elseif ($act === 'delete' && $id) { db()->prepare('DELETE FROM pages WHERE id=?')->execute([$id]); flash('Page deleted.'); }
    elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE pages SET is_published=1-is_published WHERE id=?')->execute([$id]); }
    redirect(url('admin/pages.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM pages WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM pages ORDER BY sort_order, id')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit ? 'Edit page' : 'Add a new page' ?></h2>
  <p class="muted">Create custom pages (e.g. Privacy, Refund Policy, Franchise, Study Abroad). Tick "Show in menu" to add it to the top navigation.</p>
  <form method="post"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <div class="row2">
      <div><label>Page title</label><input name="title" value="<?= e($edit['title'] ?? '') ?>" required></div>
      <div><label>URL slug <span class="help">(leave blank to auto-generate)</span></label><input name="slug" value="<?= e($edit['slug'] ?? '') ?>"></div>
    </div>
    <label>Hero subtitle <span class="help">(optional — shown in the page banner)</span></label>
    <input name="hero_subtitle" value="<?= e($edit['hero_subtitle'] ?? '') ?>">
    <label>Content <span class="help">(leave a blank line between paragraphs)</span></label>
    <textarea name="content" style="min-height:220px"><?= e($edit['content'] ?? '') ?></textarea>
    <div class="row2">
      <div><label>Sort order</label><input type="number" name="sort_order" value="<?= (int)($edit['sort_order'] ?? 0) ?>"></div>
      <div style="display:flex;gap:20px;align-items:flex-end;padding-bottom:8px">
        <label style="font-weight:normal;margin:0"><input type="checkbox" name="is_published" style="width:auto" <?= (!$edit || $edit['is_published'])?'checked':'' ?>> Published</label>
        <label style="font-weight:normal;margin:0"><input type="checkbox" name="show_in_menu" style="width:auto" <?= ($edit && $edit['show_in_menu'])?'checked':'' ?>> Show in menu</label>
      </div>
    </div>
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Create page' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/pages.php')) ?>">Cancel</a> <a class="btn ghost" target="_blank" href="<?= e(url('page.php?slug=' . urlencode($edit['slug']))) ?>">Preview ↗</a><?php endif; ?></div>
  </form>
</div>

<div class="card"><h2 style="margin-top:0">All pages</h2>
  <?php if (!$rows): ?><p class="muted">No custom pages yet.</p>
  <?php else: ?>
  <div style="overflow-x:auto"><table>
    <tr><th>Order</th><th>Title</th><th>URL</th><th>In menu</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $p): ?>
    <tr>
      <td><?= (int)$p['sort_order'] ?></td>
      <td><strong><?= e($p['title']) ?></strong></td>
      <td class="muted">/page.php?slug=<?= e($p['slug']) ?></td>
      <td><?= $p['show_in_menu']?'<span class="pill on">Yes</span>':'<span class="pill off">No</span>' ?></td>
      <td><span class="pill <?= $p['is_published']?'on':'off' ?>"><?= $p['is_published']?'Published':'Draft' ?></span></td>
      <td><div class="actions">
        <a class="btn sm ghost" href="?edit=<?= (int)$p['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="btn sm gray"><?= $p['is_published']?'Unpublish':'Publish' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this page?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td>
    </tr>
    <?php endforeach; ?>
  </table></div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
