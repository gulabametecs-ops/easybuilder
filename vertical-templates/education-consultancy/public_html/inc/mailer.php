<?php
require_once __DIR__ . '/functions.php';

/**
 * Sends an email using PHP's mail() (works on Hostinger shared hosting when the
 * From address is a mailbox on your own domain). Returns true/false.
 *
 * If you prefer SMTP, you can drop PHPMailer into inc/ and swap this out;
 * the rest of the site only calls send_mail().
 */
function send_mail(string $to, string $subject, string $htmlBody): bool
{
    $fromEmail = defined('MAIL_FROM') ? MAIL_FROM : ('no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
    $fromName  = defined('MAIL_FROM_NAME') ? MAIL_FROM_NAME : SITE_NAME;

    $headers   = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . mb_encode_mimeheader($fromName) . ' <' . $fromEmail . '>';
    $headers[] = 'Reply-To: ' . $fromEmail;
    $headers[] = 'X-Mailer: PHP/' . phpversion();

    return @mail(
        $to,
        '=?UTF-8?B?' . base64_encode($subject) . '?=',
        $htmlBody,
        implode("\r\n", $headers)
    );
}

/** Formats a submission array into an HTML email and sends it to the admin. */
function notify_new_submission(array $s): bool
{
    $to = setting('notify_email', defined('NOTIFY_EMAIL') ? NOTIFY_EMAIL : '');
    if (!$to) return false;

    $rows = '';
    $fields = [
        'Type'       => ucfirst($s['type'] ?? ''),
        'Name'       => $s['name'] ?? '',
        'Email'      => $s['email'] ?? '',
        'Mobile'     => $s['mobile'] ?? '',
        'Date of Birth' => $s['dob'] ?? '',
        'University'  => $s['university'] ?? '',
        'Course'     => $s['course'] ?? '',
        'Message'    => $s['message'] ?? '',
    ];
    foreach ($fields as $label => $val) {
        if ($val === '' || $val === null) continue;
        $rows .= '<tr><td style="padding:6px 12px;font-weight:bold;background:#f4f6fb;">'
              . e($label) . '</td><td style="padding:6px 12px;">' . nl2br(e($val)) . '</td></tr>';
    }

    $body = '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">'
          . '<h2 style="color:#0b4a8f">New ' . e(ucfirst($s['type'] ?? 'form')) . ' submission</h2>'
          . '<table style="border-collapse:collapse;width:100%;border:1px solid #e2e6ef">' . $rows . '</table>'
          . '<p style="color:#888;font-size:12px;margin-top:16px">Sent automatically from '
          . e(SITE_NAME) . ' website.</p></div>';

    return send_mail($to, 'New ' . ($s['type'] ?? 'form') . ' enquiry — ' . SITE_NAME, $body);
}
