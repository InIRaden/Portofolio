-- Create Database
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rmahesa_db;

-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    stack TEXT,
    live_url VARCHAR(255),
    github_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Resume Data Table
CREATE TABLE IF NOT EXISTS resume_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Contact Info Table
CREATE TABLE IF NOT EXISTS contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field_name VARCHAR(50) NOT NULL UNIQUE,
    field_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create CV Files Table
CREATE TABLE IF NOT EXISTS cv_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INT,
    is_active BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Stats Table
CREATE TABLE IF NOT EXISTS stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_key VARCHAR(100) NOT NULL UNIQUE,
    stat_value INT NOT NULL DEFAULT 0,
    stat_label VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default stats
INSERT INTO stats (stat_key, stat_value, stat_label, display_order) VALUES
('years_experience', 0, 'Year of experience', 1),
('projects_completed', 3, 'Projects completed', 2),
('technologies_mastered', 5, 'Technologies mastered', 3),
('code_commits', 0, 'Code commit', 4)
ON DUPLICATE KEY UPDATE stat_key=stat_key;

-- Insert default contact info
INSERT INTO contact_info (field_name, field_value) VALUES
('phone', '+62 858-8076-0901'),
('email', 'iniradenmahesa8@gmail.com'),
('address', 'Indonesia'),
('github', 'https://github.com/InIRaden'),
('linkedin', 'https://linkedin.com/in/yourusername'),
('twitter', 'https://twitter.com/yourusername')
ON DUPLICATE KEY UPDATE field_name=field_name;

-- Insert default resume data
-- About section
INSERT INTO resume_data (section, content, order_index) VALUES
('about', 'Saya adalah seorang developer yang passionate dalam menciptakan solusi digital yang inovatif dan user-friendly.', 0),
('about', '{"fieldName":"Name","fieldValue":"Raden Mahesa"}', 1),
('about', '{"fieldName":"Phone","fieldValue":"(+62) 858-8076-0901"}', 2),
('about', '{"fieldName":"Experience","fieldValue":"<1 Years"}', 3),
('about', '{"fieldName":"Instagram","fieldValue":"@ramdm__"}', 4),
('about', '{"fieldName":"Nationality","fieldValue":"Indonesia"}', 5),
('about', '{"fieldName":"Email","fieldValue":"iniradenmahesa8@gmail.com"}', 6),
('about', '{"fieldName":"Freelance","fieldValue":"Available"}', 7),
('about', '{"fieldName":"Languages","fieldValue":"English & Indonesian"}', 8)
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- Experience section
INSERT INTO resume_data (section, content, order_index) VALUES
('experience', 'Pengalaman kerja saya mencakup berbagai posisi yang membantu saya berkembang di bidang teknologi dan administrasi.', 0),
('experience', '{"company":"Perusahaan Listrik Negara","position":"Teknisi","duration":"2021 - 2023"}', 1),
('experience', '{"company":"Perusahaan Listrik Negara","position":"Admin","duration":"2023 - 2024"}', 2),
('experience', '{"company":"Badan Kesatuan Bangsa dan Politik","position":"Admin","duration":"2021 - 2022"}', 3),
('experience', '{"company":"Hotel Discovery","position":"Waiters","duration":"2021 - 2023"}', 4)
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- Education section
INSERT INTO resume_data (section, content, order_index) VALUES
('education', 'Perjalanan pendidikan saya dari SD hingga perguruan tinggi membentuk fondasi pengetahuan dan keterampilan saya.', 0),
('education', '{"institution":"SDN Tanah Sereal","degree":"Siswa","duration":"2011 - 2017"}', 1),
('education', '{"institution":"SMP Negeri 63 Jakarta","degree":"Siswa","duration":"2017 - 2020"}', 2),
('education', '{"institution":"SMK YP IPPI Petojo","degree":"Siswa","duration":"2020 - 2023"}', 3),
('education', '{"institution":"Universitas Pendidikan Indonesia","degree":"Mahasiswa","duration":"2023 - Present"}', 4)
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- Skills section
INSERT INTO resume_data (section, content, order_index) VALUES
('skills', 'Teknologi dan tools yang saya kuasai untuk membangun aplikasi web modern dan responsif.', 0),
('skills', '{"name":"html 5"}', 1),
('skills', '{"name":"css 3"}', 2),
('skills', '{"name":"javascript"}', 3),
('skills', '{"name":"php"}', 4),
('skills', '{"name":"react.js"}', 5),
('skills', '{"name":"next.js"}', 6),
('skills', '{"name":"tailwind.css"}', 7),
('skills', '{"name":"figma"}', 8)
ON DUPLICATE KEY UPDATE content=VALUES(content);

