<?php
/**
 * Hamza Consultancy - one-click installer.
 * Open this in your browser ONCE (https://yourdomain.com/install.php),
 * create your admin login, then DELETE this file.
 *
 * Safe to re-run: it only creates missing tables and only seeds empty ones.
 */
require_once __DIR__ . '/inc/functions.php';

$errors = [];
$done   = false;

$schema = [
"CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(60) PRIMARY KEY,
  setting_value TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS sliders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) DEFAULT '',
  subtitle VARCHAR(300) DEFAULT '',
  image VARCHAR(255) DEFAULT '',
  button_text VARCHAR(80) DEFAULT '',
  button_link VARCHAR(255) DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(160) DEFAULT '',
  icon VARCHAR(40) DEFAULT '',
  short_desc VARCHAR(300) DEFAULT '',
  description TEXT,
  image VARCHAR(255) DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS universities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(160) DEFAULT '',
  short_desc VARCHAR(300) DEFAULT '',
  description TEXT,
  logo VARCHAR(255) DEFAULT '',
  location VARCHAR(150) DEFAULT '',
  website VARCHAR(200) DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  university_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  level VARCHAR(60) DEFAULT '',
  duration VARCHAR(60) DEFAULT '',
  fees VARCHAR(60) DEFAULT '',
  description TEXT,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote TEXT NOT NULL,
  student_name VARCHAR(120) NOT NULL,
  university VARCHAR(150) DEFAULT '',
  photo VARCHAR(255) DEFAULT '',
  rating TINYINT DEFAULT 5,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  position VARCHAR(120) DEFAULT '',
  photo VARCHAR(255) DEFAULT '',
  bio TEXT,
  facebook VARCHAR(200) DEFAULT '',
  linkedin VARCHAR(200) DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE,
  excerpt VARCHAR(400) DEFAULT '',
  content MEDIUMTEXT,
  image VARCHAR(255) DEFAULT '',
  author VARCHAR(120) DEFAULT '',
  is_published TINYINT(1) DEFAULT 1,
  published_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(300) NOT NULL,
  answer TEXT,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) DEFAULT '',
  image VARCHAR(255) DEFAULT '',
  category VARCHAR(100) DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image VARCHAR(255) DEFAULT '',
  event_date DATE,
  location VARCHAR(200) DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(120) NOT NULL,
  value VARCHAR(30) NOT NULL,
  suffix VARCHAR(10) DEFAULT '',
  icon VARCHAR(40) DEFAULT '',
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  logo VARCHAR(255) DEFAULT '',
  link VARCHAR(255) DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE,
  content MEDIUMTEXT,
  hero_subtitle VARCHAR(300) DEFAULT '',
  is_published TINYINT(1) DEFAULT 1,
  show_in_menu TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

"CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('consultation','application','contact') NOT NULL,
  name VARCHAR(150) DEFAULT '',
  email VARCHAR(150) DEFAULT '',
  mobile VARCHAR(40) DEFAULT '',
  dob VARCHAR(40) DEFAULT '',
  university VARCHAR(150) DEFAULT '',
  course VARCHAR(200) DEFAULT '',
  message TEXT,
  is_read TINYINT(1) DEFAULT 0,
  ip VARCHAR(64) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (type), INDEX (is_read), INDEX (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
];

try {
    ensure_database();          // create the database if it doesn't exist (local/root)
    $pdo = db();
    foreach ($schema as $sql) $pdo->exec($sql);

    /* ---- Settings (fills only missing keys) ---- */
    $defaults = [
        'site_name'      => 'Hamza Consultancy',
        'tagline'        => 'Your trusted partner for higher education',
        'phone'          => '+91-9102129391',
        'phone2'         => '',
        'email'          => 'info@hamzaconsultancy.com',
        'whatsapp'       => '919102129391',
        'address'        => 'Sarswa, Motihari, Bihar, India - 845401',
        'business_hours' => 'Mon - Sat: 10:00 AM - 6:00 PM',
        'facebook'       => 'https://www.facebook.com/profile.php?id=61559974225558',
        'instagram'      => 'https://www.instagram.com/aftabakhtar7',
        'youtube'        => '',
        'twitter'        => '',
        'linkedin'       => '',
        'map_embed'      => '',
        'notify_email'   => defined('NOTIFY_EMAIL') ? NOTIFY_EMAIL : 'info@hamzaconsultancy.com',
        'marquee_enabled'=> '1',
        'theme'          => 'navy',
        'popup_enabled'  => '1',
        'popup_delay'    => '1200',
        'hero_mode'      => 'static',
        'hero_title'     => 'India\'s Trusted Higher Education Admission Partner',
        'hero_tagline'   => 'Online · Distance · Regular · Part-Time Programs',
        'hero_subtitle'  => 'Helping students get admission into India\'s top universities with expert counselling and complete end-to-end support.',
        'sec_partners'=>'1','sec_modes'=>'1','sec_popular'=>'1','sec_process'=>'1','sec_why'=>'1','sec_featured'=>'1','sec_stats'=>'1','sec_testimonials'=>'1','sec_blog'=>'1',
        'about_short'    => 'Hamza Consultancy helps students choose the right course and university and guides them through the entire admission journey.',
        'about_full'     => "Hamza Consultancy is a trusted educational consultancy dedicated to helping students achieve their academic goals. From choosing the right program to completing admission formalities, our experienced counselors are with you at every step.\n\nWe partner with leading Indian universities to offer a wide range of online and distance-learning programs so you can study from anywhere, at your own pace.",
        'mission'        => 'To make quality higher education accessible to every student through honest guidance and end-to-end admission support.',
        'vision'         => 'To be the most trusted education consultancy for students seeking admission to reputed universities across India.',
        'footer_about'   => 'Guiding students to the right courses, universities and careers with honest, expert advice.',
        'seo_description'=> 'Hamza Consultancy — expert educational consultancy for admissions, courses and career guidance across top Indian universities.',
        'seo_keywords'   => 'educational consultancy, admissions, distance education, Mizoram University, Jamia Hamdard, Aligarh Muslim University',
    ];
    $ins = $pdo->prepare('INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)');
    foreach ($defaults as $k => $v) $ins->execute([$k, $v]);

    /* ---- Universities + courses ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM universities')->fetchColumn() === 0) {
        $uni = [
            ['Mizoram University', 'mizoram-university', 'A central university located in Aizawl offering flexible online programs.', 'Aizawl, Mizoram', 'mizoram.png'],
            ['Jamia Hamdard', 'jamia-hamdard', 'A research-focused deemed university in New Delhi.', 'New Delhi', 'jamia.png'],
            ['Aligarh Muslim University', 'aligarh-muslim-university', 'A renowned public central university in India.', 'Aligarh, Uttar Pradesh', 'amu.png'],
        ];
        $uStmt = $pdo->prepare('INSERT INTO universities (name, slug, short_desc, location, logo, sort_order) VALUES (?,?,?,?,?,?)');
        $ids = [];
        foreach ($uni as $i => $u) { $uStmt->execute([$u[0],$u[1],$u[2],$u[3],$u[4],$i]); $ids[$u[0]] = $pdo->lastInsertId(); }

        $mizoram = [
            'Bachelor in Computer Applications','B.Com E-Commerce','B.Com E-Accounting','BBA (E-Business)',
            'M.Com E-Commerce','M.A. Education','M.A. Psychology','Master of Social Work',
            'MBA - Logistics & Supply Chain Management','MBA - Big Data Analytics','MBA - Financial Management',
            'MBA - Entrepreneurship','MBA - Marketing','MBA - General',
            'Executive Diploma in Application Development','Executive Diploma in Internet of Things',
            'Executive Diploma in Artificial Intelligence','Executive Diploma in Cyber Security',
            'Diploma in Computer Applications','Executive Program in General Management',
            'Executive Program in Human Resource Management','Executive Program in Marketing Management',
            'Executive Program in Finance Management','Executive Program in Retail Management',
            'Executive Program in Operations Management','Executive Program in Banking & Finance Management',
            'Executive Program in Information Technology',
            'Certificate Course in Computerized Accounting','Certificate Course in Advanced Digital Marketing',
            'Certificate Course in Android App Development','Certificate Course in GST',
            'Diploma in Foreign Language - French','Diploma in Naturopathy & Yoga Science',
            'Diploma in Foreign Language - Japanese',
        ];
        $jamia = [
            'Bachelor of Commerce','Bachelor of Business Administration','Bachelor of Computer Application',
            'Master of Islamic Studies','Master of Business Administration (MBA)','Master of Computer Applications (MCA)',
            'MA - Political Science','Certificate in Modern Persian Language (CMPL)',
            'Online Diploma in Professional Arabic (PDA)','Online Diploma in Bakery and Confectionery Technology (DBCT)',
            'Advanced Diploma in Dietetics and Therapeutics Nutrition (ADDTN)',
            'Advanced Diploma in Drug Regulatory Affairs (ADDRA)','Advanced Diploma in Medical Record Technology',
        ];
        $amu = [
            'B.A. (Hons) — Distance', 'B.Com (Hons) — Distance', 'M.A. — Distance', 'M.Com — Distance',
            'MBA — Distance', 'Diploma Programs',
        ];
        $cStmt = $pdo->prepare('INSERT INTO courses (university_id, title, sort_order) VALUES (?,?,?)');
        foreach ($mizoram as $i => $t) $cStmt->execute([$ids['Mizoram University'], $t, $i]);
        foreach ($jamia   as $i => $t) $cStmt->execute([$ids['Jamia Hamdard'], $t, $i]);
        foreach ($amu     as $i => $t) $cStmt->execute([$ids['Aligarh Muslim University'], $t, $i]);
    }

    /* ---- Services ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM services')->fetchColumn() === 0) {
        $svc = [
            ['Admission Guidance', '🎓', 'End-to-end support to secure admission at your preferred university.'],
            ['Course Counseling', '🧭', 'Personalized advice on the right UG, PG, diploma or certificate program.'],
            ['Application Support', '📝', 'Help with forms, documents and deadlines so nothing is missed.'],
            ['Career Planning', '🚀', 'Guidance on how your course maps to future career opportunities.'],
            ['University Selection', '🏛️', 'Match your goals and budget with the right partner university.'],
            ['Online & Distance Learning', '💻', 'Flexible programs that let you study from anywhere, at your own pace.'],
        ];
        $s = $pdo->prepare('INSERT INTO services (title, slug, icon, short_desc, sort_order) VALUES (?,?,?,?,?)');
        foreach ($svc as $i => $v) $s->execute([$v[0], slugify($v[0]), $v[1], $v[2], $i]);
    }

    /* ---- Testimonials ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM testimonials')->fetchColumn() === 0) {
        $t = [
            ['Thanks to your consultation, I got into my dream university!', 'Aisha Khan', 'Aligarh Muslim University'],
            ["Your services were outstanding, and I couldn't be happier!", 'Rahul Verma', 'Mizoram University'],
            ['I got admission stress-free — highly recommended!', 'Priya Sharma', 'Aligarh Muslim University'],
            ['Your team made the whole process so smooth!', 'Suresh Mehta', 'Jamia Hamdard'],
            ['Best admission consultants! Highly recommend to everyone.', 'Fatima Siddiqui', 'Mizoram University'],
            ['I am grateful for the consultation that secured my spot.', 'Ravi Gupta', 'Jamia Hamdard'],
            ['Thank you for guiding me step-by-step!', 'Anjali Nair', 'Aligarh Muslim University'],
            ['Your expert advice made my application simple.', 'Meera Patel', 'Mizoram University'],
            ['I am now studying my dream course, all thanks to your help!', 'Ahmed Khan', 'Jamia Hamdard'],
            ['Never thought it would be this easy — thank you!', "John D'Souza", 'Aligarh Muslim University'],
            ["Amazing service! The team truly cares about students' success.", 'Sunil Malhotra', 'Mizoram University'],
            ['The consultation was excellent, and I got admitted easily!', 'Preeti Kaur', 'Jamia Hamdard'],
        ];
        $ts = $pdo->prepare('INSERT INTO testimonials (quote, student_name, university, sort_order) VALUES (?,?,?,?)');
        foreach ($t as $i => $r) $ts->execute([$r[0], $r[1], $r[2], $i]);
    }

    /* ---- Team ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM team_members')->fetchColumn() === 0) {
        $team = [
            ['Aftab Akhtar', 'Founder & Senior Counselor', 'Guiding students to the right course and university for years.'],
            ['Admissions Team', 'Admission Advisors', 'Helping you with forms, documents and every admission formality.'],
            ['Support Team', 'Student Support', 'Answering your questions and supporting you throughout your journey.'],
        ];
        $tm = $pdo->prepare('INSERT INTO team_members (name, position, bio, sort_order) VALUES (?,?,?,?)');
        foreach ($team as $i => $m) $tm->execute([$m[0], $m[1], $m[2], $i]);
    }

    /* ---- Blog ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM blog_posts')->fetchColumn() === 0) {
        $posts = [
            ['How to Choose the Right University for Distance Education',
             'A simple guide to picking a recognized university and a course that truly fits your career goals.',
             "Choosing the right university is one of the most important decisions of your academic life. Look for UGC recognition, NAAC accreditation, flexible learning options and strong student support.\n\nStart by listing your career goals, then shortlist universities that offer matching programs. Compare the syllabus, fees, study material, exam pattern and the support you'll receive as a distance learner.\n\nOur counselors help you compare universities, courses, fees and outcomes side by side so you can decide with complete confidence — for free."],
            ['Top Online Courses in Demand This Year',
             'From MBA specializations to computer applications — here are the programs students are choosing most.',
             "Online and distance programs have opened doors for working professionals and students alike. MBA (Marketing, Finance, HR), BCA/MCA, B.Com and various diploma courses continue to be in high demand.\n\nEmployers increasingly value skills and specialisations over the mode of study. Certificate and executive programs in digital marketing, data analytics and cyber security are also growing fast.\n\nTalk to us for a free consultation to find the program that best matches your goals and budget."],
            ['5 Documents You Need Ready Before Applying',
             'Keep these documents handy to make your admission process fast and completely hassle-free.',
             "Before you apply, keep the following ready: 1) Photo ID, 2) 10th & 12th marksheets, 3) Latest qualifying degree/marksheet, 4) Passport-size photograph, 5) A valid email and mobile number.\n\nHaving clear, scanned copies ready speeds up your application dramatically and avoids last-minute stress.\n\nWe review your documents to make sure your application is complete and correct the very first time."],
            ['Distance MBA vs Regular MBA: Which One Is Right for You?',
             'Weigh flexibility, cost and career impact to decide which MBA format suits your life.',
             "A regular MBA offers a full-time campus experience, while a distance or online MBA lets you study alongside a job. Both can be equally valuable depending on your situation.\n\nIf you're already working or cannot relocate, a distance MBA from a recognized university gives you the same qualification with far more flexibility and lower cost.\n\nOur team helps you pick the right specialisation — Marketing, Finance, HR, Operations and more — based on your career path."],
            ['Is an Online Degree Valid in India? UGC Rules Explained',
             'Understand recognition, equivalence and what makes an online degree fully valid.',
             "Yes — degrees earned through online and distance mode from UGC-recognized universities are valid and treated as equivalent to regular degrees for higher studies and employment.\n\nAlways verify that the university and the specific program are approved by the UGC-DEB. This single check protects your time and money.\n\nWe only work with recognized universities and share the approval details for every program we recommend."],
            ['Career Options After BCA and MCA in 2025',
             'Explore the roles, skills and salaries you can target after a computer applications degree.',
             "A BCA or MCA opens doors to roles like software developer, web developer, data analyst, system administrator and IT support specialist.\n\nPairing your degree with in-demand skills — programming, databases, cloud and cyber security — makes you far more employable.\n\nDistance BCA/MCA programs let you build these skills while gaining a recognized qualification at your own pace."],
            ['How to Balance a Job While Studying Online',
             'Practical tips to manage work, study and life without burning out.',
             "Studying online while working is very achievable with a simple plan. Set fixed study hours, break topics into small daily goals and use weekends for revision.\n\nOnline programs are designed for flexibility — recorded lectures and digital material mean you learn whenever it suits you.\n\nStay consistent, ask for help early, and lean on our student support whenever you feel stuck."],
            ['Scholarships and Fee Options for Distance Learners',
             'From instalment plans to merit support — ways to make your education affordable.',
             "Many universities offer easy instalment options so you can pay your fees in comfortable parts instead of all at once.\n\nMerit-based concessions, early-bird discounts and category-based support may also be available depending on the university and program.\n\nDuring your free consultation we'll walk you through every fee and payment option so there are no surprises."],
            ['B.Com vs BBA: Which Commerce Course Should You Pick?',
             'A clear comparison to help you choose between a B.Com and a BBA degree.',
             "B.Com focuses on accounting, taxation and finance, making it ideal if you enjoy numbers and want a career in commerce or CA/CS.\n\nBBA is broader and management-oriented, great if you aim for business, marketing or entrepreneurship roles.\n\nTell us your interests and we'll recommend the course — and university — that fits your ambitions best."],
            ['A Step-by-Step Guide to the Admission Process',
             'Exactly what happens from your first enquiry to final enrolment.',
             "Step 1: Free consultation to understand your goals. Step 2: We shortlist the best-fit course and university. Step 3: Document verification and form filling.\n\nStep 4: Fee payment and application submission. Step 5: Confirmation of admission and access to your study material.\n\nOur team stays with you through every single step so the process feels effortless."],
            ['Benefits of Learning a Foreign Language Course',
             'How a language certificate can boost your career and open global doors.',
             "Learning a foreign language like Arabic, Persian, French or Japanese adds a powerful skill to your resume and improves job prospects in translation, tourism, trade and more.\n\nShort diploma and certificate courses let you gain proficiency without a long time commitment.\n\nAsk us which language program aligns best with your career or higher-study plans."],
            ['How Distance Education Is Shaping India\'s Future Workforce',
             'Why flexible, affordable learning is powering the next generation of professionals.',
             "Distance and online education is making quality higher learning accessible to students in every corner of the country, including those who work or have family responsibilities.\n\nAs employers focus more on skills and qualifications than on the mode of study, distance graduates are competing and winning on merit.\n\nWith the right guidance, distance education can be your affordable, flexible path to a strong career."],
        ];
        $covers = ['cover1.svg','cover2.svg','cover3.svg','cover4.svg','cover5.svg','cover6.svg'];
        $bp = $pdo->prepare('INSERT INTO blog_posts (title, slug, excerpt, content, image, author, is_published, published_at) VALUES (?,?,?,?,?,?,1,DATE_SUB(CURDATE(), INTERVAL ? DAY))');
        foreach ($posts as $i => $p) $bp->execute([$p[0], slugify($p[0]), $p[1], $p[2], $covers[$i % 6], 'Hamza Consultancy', $i * 5]);
    }

    /* ---- FAQs ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM faqs')->fetchColumn() === 0) {
        $faq = [
            ['Is the consultation really free?', 'Yes. Our initial consultation is completely free with no obligation. Just fill the form and our team will contact you.'],
            ['Are these universities recognized?', 'We work only with recognized universities. Our counselors share the UGC recognition and accreditation details for each program before you apply.'],
            ['Can I study while working?', 'Absolutely. Most programs we offer are online/distance learning, specially designed for working professionals and busy students.'],
            ['How do I apply for a course?', 'Click "Apply" on any course, fill in your details, and our team will guide you through document submission and the rest of the process.'],
            ['What documents are required?', 'Typically a photo ID, your 10th/12th and previous degree marksheets, a passport photo and your contact details. We confirm the exact list for your chosen course.'],
            ['How long does the admission take?', 'It varies by university and program, but our team works to make the process as fast and smooth as possible — often within a few days once documents are ready.'],
            ['Is an online/distance degree valid?', 'Yes. Degrees from UGC-recognized universities earned in online/distance mode are valid and equivalent to regular degrees for jobs and higher studies.'],
            ['Do you provide placement assistance?', 'We focus on admissions and guidance. While we do not guarantee placement, we advise you on skills and specialisations that improve your employability.'],
            ['Are the degrees valid for government jobs?', 'Degrees from UGC-recognized universities are generally accepted for government jobs and exams. We share recognition details so you can apply with confidence.'],
            ['How much do the courses cost?', 'Fees vary by university and program. During your free consultation we explain the full fee and any available instalment options — with no hidden charges.'],
            ['Can I pay the fees in instalments?', 'Many universities offer easy instalment plans. We help you understand the payment options available for your chosen program.'],
            ['Is there any age limit for admission?', 'Most distance and online programs have no upper age limit, making them ideal for learners of every age. We confirm eligibility for your specific course.'],
            ['Can I switch my course after enrolling?', 'Course-change rules depend on the university and timing. Contact us early and we will guide you on the available options.'],
            ['How can I track my application status?', 'Our team keeps you updated at every step, and you can always reach us on WhatsApp or phone for a quick status update.'],
        ];
        $fq = $pdo->prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?,?,?)');
        foreach ($faq as $i => $f) $fq->execute([$f[0], $f[1], $i]);
    }

    /* ---- Events ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM events')->fetchColumn() === 0) {
        $ev = [
            ['Free Admission Counseling Camp', "Meet our expert counselors in person for free, one-on-one guidance on courses, universities, fees and the complete admission process. Walk in with your questions and walk out with a clear plan.", 'Motihari, Bihar', 7],
            ['Online Career Guidance Webinar', "Join our live online session on choosing the right course for your career goals. Learn about in-demand programs, eligibility and how distance education can work for you. Q&A included.", 'Online (Zoom)', 12],
            ['Mizoram University Admission Info Session', "Everything you need to know about Mizoram University's online programs — courses, fees, exam pattern and how to apply. Our team answers all your questions live.", 'Online (Google Meet)', 18],
            ['Career Guidance Session for Class 12 Students', "A special session for students who have just finished Class 12. Discover the best UG programs, career paths and how to plan your next step with confidence.", 'Motihari, Bihar', 25],
            ['Scholarship & Fee Support Workshop', "Understand instalment plans, concessions and how to make your higher education affordable. Bring your queries about fees and payment options.", 'Online (Zoom)', 33],
            ['Alumni Meet & Networking Event', "Connect with past students, hear their success stories and build your network. A great chance to get inspired and ask real-world questions.", 'Motihari, Bihar', 45],
        ];
        $es = $pdo->prepare('INSERT INTO events (title, description, location, event_date, sort_order) VALUES (?,?,?,DATE_ADD(CURDATE(), INTERVAL ? DAY),?)');
        foreach ($ev as $i => $e) $es->execute([$e[0], $e[1], $e[2], $e[3], $i]);
    }

    /* ---- Stats ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM stats')->fetchColumn() === 0) {
        $st = [
            ['Happy Students', '2000', '+', '🎓'],
            ['Partner Universities', '3', '', '🏛️'],
            ['Courses Offered', '50', '+', '📚'],
            ['Years of Guidance', '5', '+', '⭐'],
        ];
        $ss = $pdo->prepare('INSERT INTO stats (label, value, suffix, icon, sort_order) VALUES (?,?,?,?,?)');
        foreach ($st as $i => $s) $ss->execute([$s[0], $s[1], $s[2], $s[3], $i]);
    }

    /* ---- Partners (seed from universities so the home strip has content) ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM partners')->fetchColumn() === 0) {
        $ps = $pdo->prepare('INSERT INTO partners (name, logo, link, sort_order) VALUES (?,?,?,?)');
        foreach ($pdo->query('SELECT name, logo, slug FROM universities ORDER BY sort_order, name') as $i => $u) {
            $ps->execute([$u['name'], $u['logo'], 'university.php?slug=' . $u['slug'], $i]);
        }
    }

    /* ---- Gallery (placeholder banners until real photos are added) ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM gallery')->fetchColumn() === 0) {
        $g = [
            ['Free Counseling Session','cover1.svg','Events'],
            ['Admission Drive','cover2.svg','Events'],
            ['Career Guidance Webinar','cover3.svg','Webinars'],
            ['Student Success Meet','cover4.svg','Students'],
            ['Campus Info Session','cover5.svg','Sessions'],
            ['Workshop & Networking','cover6.svg','Events'],
        ];
        $gs = $pdo->prepare('INSERT INTO gallery (title, image, category, sort_order) VALUES (?,?,?,?)');
        foreach ($g as $i => $row) $gs->execute([$row[0], $row[1], $row[2], $i]);
    }

    /* ---- Sliders ---- */
    if ((int)$pdo->query('SELECT COUNT(*) FROM sliders')->fetchColumn() === 0) {
        $sl = [
            ['Study at India\'s Top Universities', 'Flexible online & distance programs from recognized universities.', 'Get Free Consultation', '#consult'],
            ['Admissions Open Now', 'Bachelor, Master, Diploma & Certificate courses — apply today.', 'View Courses', 'courses.php'],
        ];
        $ins2 = $pdo->prepare('INSERT INTO sliders (title, subtitle, button_text, button_link, sort_order) VALUES (?,?,?,?,?)');
        foreach ($sl as $i => $s) $ins2->execute([$s[0], $s[1], $s[2], $s[3], $i]);
    }

    $adminExists = (int)$pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn() > 0;

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$adminExists) {
        $u  = trim($_POST['username'] ?? '');
        $p  = $_POST['password'] ?? '';
        $p2 = $_POST['password2'] ?? '';
        if (strlen($u) < 3) $errors[] = 'Username must be at least 3 characters.';
        if (strlen($p) < 6) $errors[] = 'Password must be at least 6 characters.';
        if ($p !== $p2)     $errors[] = 'Passwords do not match.';
        if (!$errors) {
            $pdo->prepare('INSERT INTO admins (username, password_hash, full_name) VALUES (?,?,?)')
                ->execute([$u, password_hash($p, PASSWORD_DEFAULT), 'Administrator']);
            $done = true; $adminExists = true;
        }
    }
} catch (Throwable $ex) {
    $errors[] = 'Setup error: ' . $ex->getMessage();
}
?>
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Install — Hamza Consultancy</title>
<style>
 body{font-family:system-ui,Arial,sans-serif;background:#eef2f9;margin:0;color:#1c2635}
 .box{max-width:480px;margin:6vh auto;background:#fff;padding:32px;border-radius:14px;box-shadow:0 10px 40px rgba(20,50,90,.12)}
 h1{color:#0b4a8f;margin:0 0 4px;font-size:22px} p.sub{color:#607089;margin:0 0 20px}
 label{display:block;font-weight:600;margin:14px 0 5px;font-size:14px}
 input{width:100%;padding:11px 13px;border:1px solid #cdd6e6;border-radius:8px;font-size:15px;box-sizing:border-box}
 button{margin-top:20px;width:100%;background:#0b4a8f;color:#fff;border:0;padding:13px;border-radius:8px;font-size:16px;cursor:pointer}
 .msg{padding:12px 14px;border-radius:8px;margin-bottom:14px;font-size:14px}
 .err{background:#fde8e8;color:#a12020} .ok{background:#e6f6ec;color:#1c7a3f} code{background:#f0f3f9;padding:2px 6px;border-radius:5px}
</style></head><body>
<div class="box">
  <h1>Hamza Consultancy — Setup</h1>
  <p class="sub">All tables and starter content are ready.</p>
  <?php foreach ($errors as $er): ?><div class="msg err"><?= e($er) ?></div><?php endforeach; ?>
  <?php if ($done): ?>
    <div class="msg ok"><strong>All set!</strong> Admin account created.</div>
    <p>Now <strong>delete <code>install.php</code></strong> from your server.</p>
    <p><a href="<?= e(base_url()) ?>/admin/login.php">Go to admin login →</a></p>
    <p><a href="<?= e(base_url()) ?>/">View your website →</a></p>
  <?php elseif (!empty($adminExists)): ?>
    <div class="msg ok">Setup already complete. Please <strong>delete install.php</strong>.</div>
    <p><a href="<?= e(base_url()) ?>/admin/login.php">Go to admin login →</a></p>
  <?php else: ?>
    <form method="post">
      <label>Admin username</label><input name="username" value="<?= e($_POST['username'] ?? 'admin') ?>" required>
      <label>Password</label><input type="password" name="password" required>
      <label>Confirm password</label><input type="password" name="password2" required>
      <button type="submit">Create admin & finish</button>
    </form>
  <?php endif; ?>
</div>
</body></html>
