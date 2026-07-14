<?php
require_once __DIR__ . '/db.php';

/** Escape for safe HTML output. */
function e($v): string
{
    return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
}

/** Auto-detect the site base URL (no trailing slash). */
function base_url(): string
{
    if (defined('BASE_URL') && BASE_URL !== '') {
        return rtrim(BASE_URL, '/');
    }
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
    // Directory of the app (handles installs in a subfolder)
    $dir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
    // If we are inside /admin or /api, climb one level to the site root
    $dir = preg_replace('#/(admin|api)(/.*)?$#', '', $dir);
    $dir = rtrim($dir, '/');
    return $scheme . '://' . $host . $dir;
}

function asset(string $path): string
{
    return base_url() . '/assets/' . ltrim($path, '/');
}

function url(string $path = ''): string
{
    return base_url() . '/' . ltrim($path, '/');
}

/** Returns a university logo URL, falling back to a placeholder if the file is missing. */
function uni_logo(string $logo): string
{
    $logo = trim($logo);
    if ($logo !== '') {
        if (is_file(__DIR__ . '/../assets/uploads/' . $logo)) return asset('uploads/' . $logo);
        if (is_file(__DIR__ . '/../assets/images/' . $logo))  return asset('images/' . $logo);
    }
    return asset('images/placeholder.svg');
}

/**
 * Returns a URL for an uploaded image, or a placeholder if empty/missing.
 * Stored values are just file names inside /assets/uploads/.
 */
function upload_url(string $file, string $placeholder = 'placeholder.svg'): string
{
    $file = trim($file);
    if ($file !== '' && is_file(__DIR__ . '/../assets/uploads/' . $file)) {
        return asset('uploads/' . $file);
    }
    return asset('images/' . $placeholder);
}

/** Available site colour themes (id => palette + label). */
function themes(): array
{
    return [
        'navy'     => ['label' => 'Navy & Gold',     'navy' => '#0e2a54', 'navy_d' => '#0a2144', 'sky' => '#1c4d8f', 'accent' => '#c99a3f', 'accent_d' => '#a87f2e', 'gold_l' => '#e0be79'],
        'emerald'  => ['label' => 'Emerald & Gold',  'navy' => '#0c3b2e', 'navy_d' => '#082a20', 'sky' => '#12674c', 'accent' => '#d4a24a', 'accent_d' => '#b0812f', 'gold_l' => '#ecd08a'],
        'maroon'   => ['label' => 'Royal Maroon',    'navy' => '#5c1a2e', 'navy_d' => '#43101f', 'sky' => '#8a2a42', 'accent' => '#d3a24a', 'accent_d' => '#b0812f', 'gold_l' => '#ecd08a'],
        'royal'    => ['label' => 'Royal Blue',      'navy' => '#17275e', 'navy_d' => '#101a44', 'sky' => '#3454c4', 'accent' => '#f2b636', 'accent_d' => '#cd8f1c', 'gold_l' => '#ffd97a'],
        'teal'     => ['label' => 'Teal & Coral',    'navy' => '#0c4a4a', 'navy_d' => '#083636', 'sky' => '#12807a', 'accent' => '#ef8a4a', 'accent_d' => '#cf6a2a', 'gold_l' => '#f7b98c'],
        'charcoal' => ['label' => 'Charcoal & Gold', 'navy' => '#20293a', 'navy_d' => '#151b28', 'sky' => '#3a4a63', 'accent' => '#d4a24a', 'accent_d' => '#b0812f', 'gold_l' => '#ecd08a'],
        'purple'   => ['label' => 'Royal Purple',    'navy' => '#3a1d63', 'navy_d' => '#281247', 'sky' => '#6b3fa0', 'accent' => '#e0a52e', 'accent_d' => '#bd831c', 'gold_l' => '#f2cd76'],
    ];
}

/** CSS :root override for the currently selected theme. */
function theme_css(): string
{
    $all = themes();
    $t = $all[setting('theme', 'navy')] ?? $all['navy'];
    return ':root{'
        . '--navy:' . $t['navy'] . ';--navy-d:' . $t['navy_d'] . ';--blue:' . $t['navy'] . ';--blue-d:' . $t['navy_d'] . ';'
        . '--sky:' . $t['sky'] . ';--accent:' . $t['accent'] . ';--accent-d:' . $t['accent_d'] . ';--gold-l:' . $t['gold_l'] . ';'
        . '--grad:linear-gradient(135deg,' . $t['navy'] . ' 0%,' . $t['sky'] . ' 100%);'
        . '--grad-accent:linear-gradient(135deg,' . $t['accent'] . ' 0%,' . $t['accent_d'] . ' 100%);}';
}

/** Site logo (uploaded via admin) or the bundled default. */
function site_logo_url(): string
{
    $f = trim((string)setting('site_logo', ''));
    if ($f !== '' && is_file(__DIR__ . '/../assets/uploads/' . $f)) return asset('uploads/' . $f);
    return asset('images/logo.svg');
}

/** Favicon / brand mark: uploaded favicon → uploaded logo → default monogram. */
function favicon_url(): string
{
    $f = trim((string)setting('favicon', ''));
    if ($f !== '' && is_file(__DIR__ . '/../assets/uploads/' . $f)) return asset('uploads/' . $f);
    return asset('images/logo-mark.svg');
}

/** Turn a title into a URL-friendly slug. */
function slugify(string $text): string
{
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = trim($text, '-');
    $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text) ?: $text;
    $text = strtolower(preg_replace('~[^-\w]+~', '', $text));
    return $text ?: 'item-' . substr(md5($text), 0, 6);
}

/** Short plain-text excerpt from possibly-HTML content. */
function excerpt(string $html, int $len = 140): string
{
    $t = trim(preg_replace('/\s+/', ' ', strip_tags($html)));
    return mb_strlen($t) > $len ? mb_substr($t, 0, $len) . '…' : $t;
}

/**
 * Handle an <input type="file"> upload. Returns the saved file name or null.
 * $error is filled with a message when something is wrong.
 */
function handle_upload(string $field, ?string &$error = null): ?string
{
    if (empty($_FILES[$field]) || ($_FILES[$field]['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null; // nothing uploaded (not an error)
    }
    $f = $_FILES[$field];
    if ($f['error'] !== UPLOAD_ERR_OK) { $error = 'Upload failed (code ' . $f['error'] . ').'; return null; }
    if ($f['size'] > 5 * 1024 * 1024) { $error = 'Image is larger than 5 MB.'; return null; }

    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif', 'image/svg+xml' => 'svg'];
    $mime = function_exists('mime_content_type') ? mime_content_type($f['tmp_name']) : ($f['type'] ?? '');
    if (!isset($allowed[$mime])) { $error = 'Only JPG, PNG, WEBP, GIF or SVG images are allowed.'; return null; }

    $dir = __DIR__ . '/../assets/uploads';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $name = slugify(pathinfo($f['name'], PATHINFO_FILENAME));
    $name = substr($name, 0, 40) . '-' . bin2hex(random_bytes(4)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $name)) { $error = 'Could not save the uploaded image.'; return null; }
    return $name;
}

/** Delete a previously uploaded file (best effort). */
function delete_upload(?string $file): void
{
    $file = trim((string)$file);
    if ($file !== '' && is_file(__DIR__ . '/../assets/uploads/' . $file)) {
        @unlink(__DIR__ . '/../assets/uploads/' . $file);
    }
}

/** Read a setting from the settings table with an optional default. */
function setting(string $key, $default = '')
{
    static $cache = null;
    if ($cache === null) {
        $cache = [];
        try {
            foreach (db()->query('SELECT setting_key, setting_value FROM settings') as $row) {
                $cache[$row['setting_key']] = $row['setting_value'];
            }
        } catch (Throwable $e) {
            $cache = [];
        }
    }
    return array_key_exists($key, $cache) ? $cache[$key] : $default;
}

function set_setting(string $key, string $value): void
{
    $stmt = db()->prepare(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );
    $stmt->execute([$key, $value]);
}

/** Very small flash-message helper. */
function flash(string $msg = null, string $type = 'success')
{
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    if ($msg !== null) {
        $_SESSION['flash'] = ['msg' => $msg, 'type' => $type];
        return null;
    }
    if (!empty($_SESSION['flash'])) {
        $f = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $f;
    }
    return null;
}

function redirect(string $to): void
{
    header('Location: ' . $to);
    exit;
}

/** CSRF token helpers. */
function csrf_token(): string
{
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">';
}

function csrf_check(): bool
{
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    return isset($_POST['csrf'], $_SESSION['csrf'])
        && hash_equals($_SESSION['csrf'], $_POST['csrf']);
}
