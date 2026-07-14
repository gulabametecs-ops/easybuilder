-- Hamza Consultancy - database structure
-- You normally do NOT need to run this by hand: just open /install.php in your browser.
-- Kept here for reference / manual import via phpMyAdmin.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS admins (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(60) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings (
    setting_key   VARCHAR(60) PRIMARY KEY,
    setting_value TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS universities (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    short_desc  VARCHAR(255) DEFAULT '',
    logo        VARCHAR(255) DEFAULT '',
    sort_order  INT DEFAULT 0,
    is_active   TINYINT(1) DEFAULT 1,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS courses (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT NOT NULL,
    title         VARCHAR(200) NOT NULL,
    sort_order    INT DEFAULT 0,
    is_active     TINYINT(1) DEFAULT 1,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS testimonials (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    quote        TEXT NOT NULL,
    student_name VARCHAR(120) NOT NULL,
    university   VARCHAR(150) DEFAULT '',
    sort_order   INT DEFAULT 0,
    is_active    TINYINT(1) DEFAULT 1,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submissions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    type        ENUM('consultation','application','contact') NOT NULL,
    name        VARCHAR(150) DEFAULT '',
    email       VARCHAR(150) DEFAULT '',
    mobile      VARCHAR(40)  DEFAULT '',
    dob         VARCHAR(40)  DEFAULT '',
    university  VARCHAR(150) DEFAULT '',
    course      VARCHAR(200) DEFAULT '',
    message     TEXT,
    is_read     TINYINT(1) DEFAULT 0,
    ip          VARCHAR(64) DEFAULT '',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (type), INDEX (is_read), INDEX (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
