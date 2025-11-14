-- Migration: Add user roles and banned status
-- Run this if you have an existing database

ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `role` ENUM('user', 'admin') DEFAULT 'user' AFTER `password`,
ADD COLUMN IF NOT EXISTS `is_banned` BOOLEAN DEFAULT FALSE AFTER `role`,
ADD COLUMN IF NOT EXISTS `banned_at` TIMESTAMP NULL AFTER `is_banned`;

-- Add indexes
ALTER TABLE `users` 
ADD INDEX IF NOT EXISTS `idx_role` (`role`),
ADD INDEX IF NOT EXISTS `idx_is_banned` (`is_banned`);

-- Set existing admin user (if exists)
-- UPDATE `users` SET `role` = 'admin' WHERE `email` = 'admin@cybervanguard.com';

