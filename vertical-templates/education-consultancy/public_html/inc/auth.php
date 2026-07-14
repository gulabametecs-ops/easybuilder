<?php
require_once __DIR__ . '/functions.php';

function auth_start(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_name('hamza_admin');
        session_start();
    }
}

function admin_login(string $username, string $password): bool
{
    auth_start();
    $stmt = db()->prepare('SELECT * FROM admins WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    if ($admin && password_verify($password, $admin['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin_id']   = (int)$admin['id'];
        $_SESSION['admin_user'] = $admin['username'];
        return true;
    }
    return false;
}

function is_admin(): bool
{
    auth_start();
    return !empty($_SESSION['admin_id']);
}

/** Call at the top of every protected admin page. */
function require_admin(): void
{
    if (!is_admin()) {
        redirect(base_url() . '/admin/login.php');
    }
}

function admin_logout(): void
{
    auth_start();
    $_SESSION = [];
    session_destroy();
}
