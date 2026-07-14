<?php
/**
 * Hamza Consultancy - Configuration
 * -------------------------------------------------------------
 * EDIT THIS FILE after uploading to Hostinger.
 * Get the DB name / user / password from hPanel -> Databases -> MySQL Databases.
 */

// ---- Database (MySQL) ----
// NOTE: these are set for a LOCAL MySQL 8.0 install. On Hostinger, change them
// to the database name/user/password you create in hPanel (host usually 'localhost').
define('DB_HOST', '127.0.0.1:3306');      // host, or host:port
define('DB_NAME', 'hamza_db');            // <-- database name (installer creates it if missing)
define('DB_USER', 'root');                // <-- database user
define('DB_PASS', '123456');              // <-- database password
define('DB_CHARSET', 'utf8mb4');

// ---- Site ----
define('SITE_NAME', 'Hamza Consultancy');
// Leave BASE_URL empty to auto-detect. Or hard-code e.g. 'https://hamzaconsultancy.com'
define('BASE_URL', '');

// ---- Email notifications ----
// Where new-submission alerts are sent. You can also change this later in Admin > Settings.
define('NOTIFY_EMAIL', 'info@hamzaconsultancy.com');
// The "From" address. On Hostinger this should be a mailbox on YOUR domain
// (create it in hPanel > Emails), otherwise mail may be marked as spam.
define('MAIL_FROM', 'no-reply@hamzaconsultancy.com');
define('MAIL_FROM_NAME', 'Hamza Consultancy Website');

// ---- Security ----
// Change this to any long random string. Used to sign the login session.
define('APP_SECRET', 'PUT-A-LONG-RANDOM-STRING-HERE-9f83jf93');

// ---- Timezone ----
date_default_timezone_set('Asia/Kolkata');

// ---- Error display: keep OFF in production ----
error_reporting(E_ALL);
ini_set('display_errors', '0');   // set to '1' only while debugging
