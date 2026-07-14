<?php
require_once __DIR__ . '/../inc/auth.php';
require_admin();

$type = $_GET['type'] ?? '';
$q    = trim($_GET['q'] ?? '');
$where = []; $params = [];
if (in_array($type, ['consultation','application','contact'], true)) { $where[] = 'type = ?'; $params[] = $type; }
if ($q !== '') { $where[] = '(name LIKE ? OR email LIKE ? OR mobile LIKE ? OR course LIKE ? OR message LIKE ?)';
    array_push($params, "%$q%", "%$q%", "%$q%", "%$q%", "%$q%"); }
$sql = 'SELECT created_at,type,name,email,mobile,dob,university,course,message,is_read
        FROM submissions' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY created_at DESC';
$stmt = db()->prepare($sql); $stmt->execute($params);

$filename = 'submissions_' . date('Ymd_His') . '.csv';
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$out = fopen('php://output', 'w');
fprintf($out, "\xEF\xBB\xBF"); // UTF-8 BOM for Excel
fputcsv($out, ['Date','Type','Name','Email','Mobile','DOB','University','Course','Message','Read']);
foreach ($stmt as $r) {
    fputcsv($out, [
        $r['created_at'], $r['type'], $r['name'], $r['email'], $r['mobile'],
        $r['dob'], $r['university'], $r['course'], $r['message'], $r['is_read'] ? 'Yes' : 'No',
    ]);
}
fclose($out);
exit;
