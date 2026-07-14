<?php
require_once __DIR__ . '/config.php';

/** Splits DB_HOST into [host, port|null]. */
function db_host_port(): array
{
    $host = DB_HOST; $port = null;
    if (strpos($host, ':') !== false) { [$host, $port] = explode(':', $host, 2); }
    return [$host, $port ? (int)$port : null];
}

/**
 * Creates the database if it does not exist yet (best effort).
 * Needs a user with CREATE privilege (root locally). On shared hosting where the
 * database already exists, a failure here is ignored.
 */
function ensure_database(): void
{
    [$host, $port] = db_host_port();
    $dsn = 'mysql:host=' . $host . ($port ? ';port=' . $port : '');
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $name = str_replace('`', '', DB_NAME);
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    } catch (Throwable $e) {
        // ignore — the database probably already exists / no CREATE privilege
    }
}

/**
 * Returns a shared PDO connection.
 */
function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        // Allow "host:port" in DB_HOST (e.g. 127.0.0.1:3306); default port otherwise.
        [$host, $port] = db_host_port();
        $dsn = 'mysql:host=' . $host . ($port ? ';port=' . $port : '') . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            die('Database connection failed. Check inc/config.php. ' .
                (ini_get('display_errors') ? $e->getMessage() : ''));
        }
    }
    return $pdo;
}
