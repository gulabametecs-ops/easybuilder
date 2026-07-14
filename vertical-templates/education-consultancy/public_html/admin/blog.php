<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();
$adminTitle = 'Blog'; $adminActive = 'blog';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($act === 'save') {
        $title = trim($_POST['title'] ?? '');
        $excerpt = trim($_POST['excerpt'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $author = trim($_POST['author'] ?? '');
        $pubDate = trim($_POST['published_at'] ?? '') ?: date('Y-m-d');
        $published = isset($_POST['is_published']) ? 1 : 0;
        $slug = slugify($_POST['slug'] ?? $title);
        // ensure slug unique
        $chk = db()->prepare('SELECT id FROM blog_posts WHERE slug=? AND id<>?'); $chk->execute([$slug, $id]);
        if ($chk->fetch()) $slug .= '-' . substr(md5($title . microtime()), 0, 4);
        $err = null; $img = handle_upload('image_file', $err);
        if ($err) flash($err, 'error');
        elseif ($title === '') flash('Title is required.', 'error');
        else {
            if ($id) {
                if (!$img) $img = trim($_POST['existing_image'] ?? ''); else delete_upload($_POST['existing_image'] ?? '');
                db()->prepare('UPDATE blog_posts SET title=?,slug=?,excerpt=?,content=?,image=?,author=?,is_published=?,published_at=? WHERE id=?')
                   ->execute([$title,$slug,$excerpt,$content,$img,$author,$published,$pubDate,$id]); flash('Post updated.');
            } else {
                db()->prepare('INSERT INTO blog_posts (title,slug,excerpt,content,image,author,is_published,published_at) VALUES (?,?,?,?,?,?,?,?)')
                   ->execute([$title,$slug,$excerpt,$content,(string)$img,$author,$published,$pubDate]); flash('Post created.');
            }
        }
    } elseif ($act === 'delete' && $id) {
        $st = db()->prepare('SELECT image FROM blog_posts WHERE id=?'); $st->execute([$id]); delete_upload($st->fetchColumn());
        db()->prepare('DELETE FROM blog_posts WHERE id=?')->execute([$id]); flash('Post deleted.');
    } elseif ($act === 'toggle' && $id) { db()->prepare('UPDATE blog_posts SET is_published=1-is_published WHERE id=?')->execute([$id]); }
    redirect(url('admin/blog.php'));
}
$editId = (int)($_GET['edit'] ?? 0); $edit = null;
if ($editId) { $st = db()->prepare('SELECT * FROM blog_posts WHERE id=?'); $st->execute([$editId]); $edit = $st->fetch(); }
$rows = db()->query('SELECT * FROM blog_posts ORDER BY published_at DESC, id DESC')->fetchAll();
include __DIR__ . '/partials/head.php';
?>
<div class="card">
  <h2 style="margin-top:0"><?= $edit?'Edit post':'Write a new post' ?></h2>
  <form method="post" enctype="multipart/form-data"><?= csrf_field() ?>
    <input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= $edit?(int)$edit['id']:0 ?>">
    <input type="hidden" name="existing_image" value="<?= e($edit['image'] ?? '') ?>">
    <label>Title</label><input name="title" value="<?= e($edit['title'] ?? '') ?>" required>
    <label>Short excerpt <span class="help">(shown on the blog list; optional)</span></label>
    <input name="excerpt" value="<?= e($edit['excerpt'] ?? '') ?>">
    <label>Content <span class="help">(leave a blank line between paragraphs)</span></label>
    <textarea name="content" style="min-height:220px"><?= e($edit['content'] ?? '') ?></textarea>
    <div class="row2">
      <div><label>Author</label><input name="author" value="<?= e($edit['author'] ?? 'Hamza Consultancy') ?>"></div>
      <div><label>Publish date</label><input type="date" name="published_at" value="<?= e($edit['published_at'] ?? date('Y-m-d')) ?>"></div>
    </div>
    <label>Featured image</label><input type="file" name="image_file" accept="image/*">
    <?php if (!empty($edit['image'])): ?><div style="margin-top:6px"><img class="thumb-sm" style="height:60px" src="<?= e(upload_url($edit['image'])) ?>"></div><?php endif; ?>
    <label style="font-weight:normal;margin-top:10px"><input type="checkbox" name="is_published" style="width:auto" <?= (!$edit || $edit['is_published'])?'checked':'' ?>> Published (visible on site)</label>
    <div style="margin-top:16px"><button class="btn"><?= $edit?'Save changes':'Publish post' ?></button>
      <?php if ($edit): ?><a class="btn gray" href="<?= e(url('admin/blog.php')) ?>">Cancel</a> <a class="btn ghost" target="_blank" href="<?= e(url('blog-single.php?slug=' . urlencode($edit['slug']))) ?>">Preview</a><?php endif; ?></div>
  </form>
</div>
<div class="card"><h2 style="margin-top:0">All posts</h2>
  <div style="overflow-x:auto"><table>
    <tr><th>Date</th><th>Image</th><th>Title</th><th>Status</th><th>Actions</th></tr>
    <?php foreach ($rows as $p): ?>
    <tr><td class="muted" style="white-space:nowrap"><?= e(date('d M Y', strtotime($p['published_at'] ?: $p['created_at']))) ?></td>
      <td><?php if($p['image']):?><img class="thumb-sm" style="height:40px" src="<?= e(upload_url($p['image'])) ?>"><?php else:?><span class="muted">—</span><?php endif;?></td>
      <td><strong><?= e($p['title']) ?></strong></td>
      <td><span class="pill <?= $p['is_published']?'on':'off' ?>"><?= $p['is_published']?'Published':'Draft' ?></span></td>
      <td><div class="actions"><a class="btn sm ghost" href="?edit=<?= (int)$p['id'] ?>">Edit</a>
        <form method="post"><?= csrf_field() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="btn sm gray"><?= $p['is_published']?'Unpublish':'Publish' ?></button></form>
        <form method="post" onsubmit="return confirm('Delete this post?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="btn sm red">Delete</button></form>
      </div></td></tr>
    <?php endforeach; ?>
  </table></div>
</div>
<?php include __DIR__ . '/partials/foot.php'; ?>
