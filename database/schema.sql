-- CTF Platform Database Schema
-- Ready for cPanel phpMyAdmin Import
-- 
-- Instructions:
-- 1. Create a database in cPanel (or use existing one)
-- 2. Go to phpMyAdmin
-- 3. Select your database
-- 4. Click "Import" tab
-- 5. Choose this file and click "Go"

-- Note: Remove or comment out the CREATE DATABASE line if importing into existing database

-- CREATE DATABASE IF NOT EXISTS ctf_platform;
-- USE ctf_platform;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('user', 'admin') DEFAULT 'user',
    `is_banned` BOOLEAN DEFAULT FALSE,
    `banned_at` TIMESTAMP NULL,
    `total_points` INT DEFAULT 0,
    `challenges_solved` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_role` (`role`),
    INDEX `idx_is_banned` (`is_banned`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE IF NOT EXISTS `events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `banner_url` VARCHAR(500),
    `start_date` DATETIME,
    `end_date` DATETIME,
    `status` ENUM('active', 'archived', 'draft') DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Challenges table
CREATE TABLE IF NOT EXISTS `challenges` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `category` VARCHAR(100) NOT NULL,
    `difficulty` ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    `points` INT NOT NULL,
    `flag_hash` VARCHAR(64) NOT NULL COMMENT 'SHA-256 hash of the flag',
    `files` JSON,
    `challenge_link` VARCHAR(500),
    `event_id` INT,
    `status` ENUM('active', 'disabled') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE SET NULL,
    INDEX `idx_category` (`category`),
    INDEX `idx_difficulty` (`difficulty`),
    INDEX `idx_event` (`event_id`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Submitted flags table
CREATE TABLE IF NOT EXISTS `submitted_flags` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `challenge_id` INT NOT NULL,
    `flag` VARCHAR(500) NOT NULL,
    `is_correct` BOOLEAN DEFAULT FALSE,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_user_challenge` (`user_id`, `challenge_id`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_challenge` (`challenge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sponsors table
CREATE TABLE IF NOT EXISTS `sponsors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `logo_url` VARCHAR(500) NOT NULL,
    `website_url` VARCHAR(500),
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO `categories` (`name`, `description`) VALUES
('Web', 'Web application security challenges'),
('Cryptography', 'Cryptography and encryption challenges'),
('Forensics', 'Digital forensics challenges'),
('Misc', 'Miscellaneous challenges')
ON DUPLICATE KEY UPDATE `name`=`name`;
