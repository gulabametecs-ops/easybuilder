<?php
require_once __DIR__ . '/../inc/auth.php';
if (is_admin()) redirect(url('admin/index.php'));

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_check()) {
        $error = 'Session expired. Please try again.';
    } elseif (admin_login(trim($_POST['username'] ?? ''), $_POST['password'] ?? '')) {
        redirect(url('admin/index.php'));
    } else {
        $error = 'Invalid username or password.';
    }
}
?><!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin Login — <?= e(SITE_NAME) ?></title>
<link rel="icon" href="<?= e(site_logo_url()) ?>">
<style>
 body{font-family:'Segoe UI',system-ui,Arial,sans-serif;background:#eef2f9;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center}
 .box{background:#fff;padding:34px;border-radius:14px;box-shadow:0 12px 44px rgba(20,50,90,.14);width:360px;max-width:92vw}
 .box img{height:52px;display:block;margin:0 auto 14px}
 h1{font-size:20px;color:#0b4a8f;text-align:center;margin:0 0 20px}
 label{display:block;font-weight:600;font-size:13px;margin:12px 0 5px}
 input{width:100%;padding:11px 13px;border:1px solid #cdd6e6;border-radius:8px;font-size:15px;box-sizing:border-box}
 button{margin-top:20px;width:100%;background:#0b4a8f;color:#fff;border:0;padding:12px;border-radius:8px;font-size:16px;cursor:pointer}
 .err{background:#fde8e8;color:#a12020;padding:11px 14px;border-radius:8px;font-size:14px;margin-bottom:8px}
</style></head><body>
<div class="box">
  <img src="<?= e(site_logo_url()) ?>" alt="<?= e(SITE_NAME) ?>">
  <h1><?= e(SITE_NAME) ?> — Admin</h1>
  <?php if ($error): ?><div class="err"><?= e($error) ?></div><?php endif; ?>
  <form method="post">
    <?= csrf_field() ?>
    <label>Username</label>
    <input name="username" autofocus required>
    <label>Password</label>
    <input type="password" name="password" required>
    <button type="submit">Log in</button>
  </form>
</div>
</body></html>
