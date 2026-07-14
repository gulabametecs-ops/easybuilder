<?php
require_once __DIR__ . '/../inc/functions.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success'=>false,'error'=>'Invalid request.']); exit; }

$email = trim($_POST['email'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { echo json_encode(['success'=>false,'error'=>'Please enter a valid email.']); exit; }

try {
    db()->prepare('INSERT IGNORE INTO newsletter (email) VALUES (?)')->execute([mb_substr($email,0,150)]);
    echo json_encode(['success'=>true]);
} catch (Throwable $e) {
    echo json_encode(['success'=>false,'error'=>'Could not subscribe right now.']);
}
