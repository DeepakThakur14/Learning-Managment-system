const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'learnx_lms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

async function initDb() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin','instructor','student') NOT NULL DEFAULT 'student',
      status ENUM('active','pending','disabled') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(100) PRIMARY KEY,
      title VARCHAR(220) NOT NULL,
      slug VARCHAR(240) NOT NULL UNIQUE,
      category VARCHAR(100) NOT NULL,
      level VARCHAR(50) NOT NULL DEFAULT 'Beginner',
      duration VARCHAR(80) NOT NULL DEFAULT 'Self-paced',
      instructor_id CHAR(36) NULL,
      instructor_name VARCHAR(120) NOT NULL DEFAULT 'Instructor not assigned',
      rating DECIMAL(3,2) NOT NULL DEFAULT 0,
      reviews_count INT NOT NULL DEFAULT 0,
      enrolled_count INT NOT NULL DEFAULT 0,
      badge VARCHAR(80) NULL,
      thumbnail TEXT NULL,
      description TEXT NULL,
      objectives JSON NULL,
      status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_courses_status(status), INDEX idx_courses_instructor(instructor_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS course_modules (
      id VARCHAR(120) PRIMARY KEY,
      course_id VARCHAR(100) NOT NULL,
      title VARCHAR(220) NOT NULL,
      position INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      INDEX idx_modules_course(course_id, position)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS lessons (
      id VARCHAR(140) PRIMARY KEY,
      module_id VARCHAR(120) NOT NULL,
      title VARCHAR(240) NOT NULL,
      duration VARCHAR(60) NULL,
      minutes INT NOT NULL DEFAULT 0,
      video_url TEXT NULL,
      summary TEXT NULL,
      position INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE,
      INDEX idx_lessons_module(module_id, position)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS enrollments (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      student_id CHAR(36) NOT NULL,
      course_id VARCHAR(100) NOT NULL,
      enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_student_course(student_id, course_id),
      CONSTRAINT fk_enroll_user FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS lesson_progress (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      student_id CHAR(36) NOT NULL,
      lesson_id VARCHAR(140) NOT NULL,
      completed TINYINT(1) NOT NULL DEFAULT 0,
      completed_at TIMESTAMP NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_student_lesson(student_id, lesson_id),
      CONSTRAINT fk_progress_user FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS support_issues (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      user_name VARCHAR(100) NOT NULL,
      user_email VARCHAR(190) NOT NULL,
      user_role ENUM('student','instructor') NOT NULL,
      subject VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      status ENUM('Open','In Progress','Resolved') NOT NULL DEFAULT 'Open',
      admin_response TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      resolved_at TIMESTAMP NULL,
      CONSTRAINT fk_support_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_support_status_created(status, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  ];
  const conn = await pool.getConnection();
  try { for (const sql of statements) await conn.query(sql); }
  finally { conn.release(); }
}

module.exports = { pool, initDb };
