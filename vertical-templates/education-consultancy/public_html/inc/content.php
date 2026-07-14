<?php
require_once __DIR__ . '/functions.php';

/* ---------- Read helpers used by the public website ---------- */

function sliders(): array
{
    return db()->query('SELECT * FROM sliders WHERE is_active=1 ORDER BY sort_order, id')->fetchAll();
}

function services(?int $limit = null): array
{
    $sql = 'SELECT * FROM services WHERE is_active=1 ORDER BY sort_order, id';
    if ($limit) $sql .= ' LIMIT ' . (int)$limit;
    return db()->query($sql)->fetchAll();
}

function service_by_slug(string $slug): ?array
{
    $st = db()->prepare('SELECT * FROM services WHERE slug=? AND is_active=1');
    $st->execute([$slug]);
    return $st->fetch() ?: null;
}

function universities(): array
{
    return db()->query('SELECT * FROM universities WHERE is_active=1 ORDER BY sort_order, name')->fetchAll();
}

function university_by_slug(string $slug): ?array
{
    $st = db()->prepare('SELECT * FROM universities WHERE slug=? AND is_active=1');
    $st->execute([$slug]);
    return $st->fetch() ?: null;
}

function courses(?int $universityId = null): array
{
    if ($universityId) {
        $st = db()->prepare('SELECT * FROM courses WHERE is_active=1 AND university_id=? ORDER BY sort_order, title');
        $st->execute([$universityId]);
        return $st->fetchAll();
    }
    return db()->query('SELECT c.*, u.name AS university_name, u.slug AS university_slug
                        FROM courses c JOIN universities u ON u.id=c.university_id
                        WHERE c.is_active=1 AND u.is_active=1
                        ORDER BY u.sort_order, c.sort_order, c.title')->fetchAll();
}

function courses_grouped(): array
{
    $out = [];
    foreach (db()->query('SELECT * FROM courses WHERE is_active=1 ORDER BY sort_order, title') as $c) {
        $out[$c['university_id']][] = $c;
    }
    return $out;
}

function testimonials(): array
{
    if (setting('marquee_enabled', '1') !== '1') return [];
    return db()->query('SELECT * FROM testimonials WHERE is_active=1 ORDER BY sort_order, id')->fetchAll();
}

function team(): array
{
    return db()->query('SELECT * FROM team_members WHERE is_active=1 ORDER BY sort_order, id')->fetchAll();
}

function blog_posts(?int $limit = null): array
{
    $sql = 'SELECT * FROM blog_posts WHERE is_published=1 ORDER BY published_at DESC, id DESC';
    if ($limit) $sql .= ' LIMIT ' . (int)$limit;
    return db()->query($sql)->fetchAll();
}

function blog_by_slug(string $slug): ?array
{
    $st = db()->prepare('SELECT * FROM blog_posts WHERE slug=? AND is_published=1');
    $st->execute([$slug]);
    return $st->fetch() ?: null;
}

function faqs(): array
{
    return db()->query('SELECT * FROM faqs WHERE is_active=1 ORDER BY sort_order, id')->fetchAll();
}

function gallery(?int $limit = null): array
{
    $sql = 'SELECT * FROM gallery WHERE is_active=1 ORDER BY sort_order, id';
    if ($limit) $sql .= ' LIMIT ' . (int)$limit;
    return db()->query($sql)->fetchAll();
}

function events(?int $limit = null): array
{
    $sql = 'SELECT * FROM events WHERE is_active=1 ORDER BY event_date DESC, id DESC';
    if ($limit) $sql .= ' LIMIT ' . (int)$limit;
    return db()->query($sql)->fetchAll();
}

function stats(): array
{
    return db()->query('SELECT * FROM stats ORDER BY sort_order, id')->fetchAll();
}

/** University partners shown in the home "Our University Partners" strip. */
function partners(): array
{
    try {
        return db()->query('SELECT * FROM partners WHERE is_active=1 ORDER BY sort_order, id')->fetchAll();
    } catch (Throwable $e) { return []; }
}

/** Custom pages that should appear in the site menu. */
function menu_pages(): array
{
    try {
        return db()->query('SELECT * FROM pages WHERE is_published=1 AND show_in_menu=1 ORDER BY sort_order, id')->fetchAll();
    } catch (Throwable $e) { return []; }
}

function page_by_slug(string $slug): ?array
{
    try {
        $st = db()->prepare('SELECT * FROM pages WHERE slug=? AND is_published=1');
        $st->execute([$slug]);
        return $st->fetch() ?: null;
    } catch (Throwable $e) { return null; }
}

/* ---------- view helpers ---------- */

/** Returns a clean inline line-SVG icon by name (stroke uses currentColor). */
function svg_icon(string $name, string $cls = ''): string
{
    $paths = [
        'briefcase' => '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
        'monitor'   => '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
        'chart'     => '<path d="M18 20V10M12 20V4M6 20v-6"/>',
        'book'      => '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
        'brain'     => '<path d="M12 5a3 3 0 0 0-6 0 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 5 2 3 3 0 0 0 2-1"/><path d="M12 5a3 3 0 0 1 6 0 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-5 2 3 3 0 0 1-2-1"/><path d="M12 5v14"/>',
        'chat'      => '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        'health'    => '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
        'award'     => '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.9 7 23l5-3 5 3-1.2-9.1"/>',
        'cap'       => '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5"/>',
        'arrow'     => '<path d="M5 12h14M13 6l6 6-6 6"/>',
        'check'     => '<path d="M20 6 9 17l-5-5"/>',
        'phone'     => '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
        'search'    => '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
        'mail'      => '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
        'pin'       => '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
        'clock'     => '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        'calendar'  => '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
        'users'     => '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
        'star'      => '<path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/>',
        'building'  => '<path d="M3 21h18M5 21V6l7-4 7 4v15"/><path d="M9 21v-5h6v5M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/>',
        'doc'       => '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>',
        'clipboard' => '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><path d="M9 14l2 2 4-4"/>',
        'shield'    => '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
        'headset'   => '<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M6 16h1v-5H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2zM18 16h-1v-5h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2z"/><path d="M18 16v1a3 3 0 0 1-3 3h-3"/>',
        'target'    => '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
        'bulb'      => '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
        'handshake' => '<path d="M11 17l2 2a1.5 1.5 0 0 0 2-2"/><path d="M13 15l2.5 2.5a1.5 1.5 0 0 0 2-2L14 12a2 2 0 0 0-2.8 0L9.5 13.7a1.5 1.5 0 0 1-2-2L11 8"/><path d="M2 10l4 4M22 10l-4 4M6 6l3-2 3 2 3-2 3 2"/>',
        'facebook'  => '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
        'instagram' => '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
        'youtube'   => '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><path d="M9.75 15.02l5.75-3.27-5.75-3.27z"/>',
        'linkedin'  => '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
        'twitter'   => '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0 0-.83A7.72 7.72 0 0 0 23 3z"/>',
    ];
    $p = $paths[$name] ?? $paths['cap'];
    // default 1em size so icons in loose contexts (buttons, text) stay small; CSS overrides where needed
    return '<svg class="' . e($cls) . '" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">' . $p . '</svg>';
}

/** Large decorative education illustration (graduation cap + campus). Inherits currentColor. */
function edu_illustration(): string
{
    return '<svg class="illus" viewBox="0 0 240 200" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">'
        . '<path d="M120 24 40 56l80 32 80-32-80-32z"/>'
        . '<path d="M120 88v26"/><circle cx="120" cy="120" r="6" fill="currentColor" stroke="none"/>'
        . '<path d="M64 70v34c0 12 25 22 56 22s56-10 56-22V70"/>'
        . '<path d="M196 60v26"/><path d="M192 88h8l-4 12-4-12z" fill="currentColor" stroke="none"/>'
        . '<path d="M52 150h136M60 150v-16h120v16M76 150v-16M100 150v-16M140 150v-16M164 150v-16"/>'
        . '<path d="M44 176h152"/>'
        . '</svg>';
}

/** Group a course into a readable category based on its title. */
function course_category(string $title): string
{
    $t = strtolower($title);
    $rules = [
        'Management & Business'   => ['mba','business','management','entrepreneur','retail','operations','logistics','human resource','marketing'],
        'Computer & IT'           => ['computer','bca','mca','information technology','software','application','internet of things','android','artificial','cyber','data'],
        'Commerce & Finance'      => ['commerce','account','finance','banking','gst'],
        'Arts & Social Sciences'  => ['education','islamic','political','social work','psychology'],
        'Foreign Languages'       => ['arabic','persian','french','japanese','language'],
        'Health & Wellness'       => ['nutrition','dietetic','medical','drug','yoga','naturopathy','bakery'],
    ];
    foreach ($rules as $cat => $kws) { foreach ($kws as $k) { if (strpos($t, $k) !== false) return $cat; } }
    if (strpos($t, 'diploma') !== false || strpos($t, 'certificate') !== false) return 'Diplomas & Certificates';
    return 'Other Programs';
}

/** Preferred display order of course categories. */
function course_category_order(): array
{
    return ['Management & Business','Computer & IT','Commerce & Finance','Arts & Social Sciences',
        'Foreign Languages','Health & Wellness','Diplomas & Certificates','Other Programs'];
}

/** Pick an icon name for a course based on keywords in its title. */
function course_icon(string $title): string
{
    $t = strtolower($title);
    $rules = [
        'briefcase' => ['mba','business','management','entrepreneur','retail','operations','logistics','human resource','marketing'],
        'monitor'   => ['computer','bca','mca','information technology','software','application','internet of things','android','artificial','cyber','data'],
        'chart'     => ['commerce','account','finance','banking','gst'],
        'book'      => ['education','islamic','political','social work'],
        'brain'     => ['psychology'],
        'chat'      => ['arabic','persian','french','japanese','language'],
        'health'    => ['nutrition','dietetic','medical','drug','yoga','naturopathy','bakery'],
        'award'     => ['certificate','diploma'],
    ];
    foreach ($rules as $ic => $kws) { foreach ($kws as $k) { if (strpos($t, $k) !== false) return svg_icon($ic); } }
    return svg_icon('cap');
}

/** Render a premium horizontal course card (used on home, courses and university pages). */
function course_card_html(string $title, string $uniName, string $level = '', string $duration = ''): string
{
    $tags = '';
    if (trim($level) !== '')    $tags .= '<span class="xtag">' . e($level) . '</span>';
    if (trim($duration) !== '') $tags .= '<span class="xtag">' . e($duration) . '</span>';
    if ($tags === '')           $tags  = '<span class="xtag">Online / Distance</span>';
    $onclick = 'openApply(' . e(json_encode($title)) . ', ' . e(json_encode($uniName)) . ')';
    return '<div class="xcard" role="button" tabindex="0" onclick="' . $onclick . '" '
        . 'onkeydown="if(event.key===\'Enter\'){' . $onclick . '}">'
        . '<span class="xcard-ic">' . course_icon($title) . '</span>'
        . '<div class="xcard-main">'
        . '<span class="xcard-uni">' . e($uniName) . '</span>'
        . '<h3 class="xcard-title">' . e($title) . '</h3>'
        . '<div class="xcard-tags">' . $tags . '</div></div>'
        . '<span class="xcard-go">' . svg_icon('arrow') . '</span>'
        . '</div>';
}
