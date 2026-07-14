<?php
require_once __DIR__ . '/../inc/functions.php';
require_once __DIR__ . '/../inc/mailer.php';

header('Content-Type: application/json; charset=utf-8');

function fail($msg, $code = 400)
{
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Invalid request.', 405);
if (!csrf_check()) fail('Your session expired. Please refresh the page and try again.', 419);

$type = $_POST['type'] ?? '';
if (!in_array($type, ['consultation', 'application', 'contact'], true)) fail('Invalid form type.');

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$mobile  = trim($_POST['mobile'] ?? '');
$dob     = trim($_POST['dob'] ?? '');
$uni     = trim($_POST['university'] ?? '');
$course  = trim($_POST['course'] ?? '');
$message = trim($_POST['message'] ?? '');

// Basic validation
if ($name === '')  fail('Please enter your name.');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Please enter a valid email address.');
if ($type === 'contact') {
    if ($email === '')   fail('Please enter your email.');
    if ($message === '') fail('Please enter a message.');
} else {
    if ($mobile === '' && $email === '') fail('Please provide a mobile number or email.');
}

// Length guards
foreach (['name'=>150,'email'=>150,'mobile'=>40,'dob'=>40,'uni'=>150,'course'=>200] as $k=>$max) {
    if (mb_strlen($$k) > $max) fail('One of the fields is too long.');
}
$message = mb_substr($message, 0, 4000);

try {
    $stmt = db()->prepare(
        'INSERT INTO submissions (type, name, email, mobile, dob, university, course, message, ip)
         VALUES (?,?,?,?,?,?,?,?,?)'
    );
    $stmt->execute([$type, $name, $email, $mobile, $dob, $uni, $course, $message,
        substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 64)]);
} catch (Throwable $e) {
    fail('Could not save your request right now. Please try again later.', 500);
}

// Email notification (failure here should not break the user's success)
try {
    notify_new_submission(compact('type','name','email','mobile','dob','course') + ['university' => $uni, 'message' => $message]);
} catch (Throwable $e) { /* ignore mail errors */ }

echo json_encode(['success' => true]);
