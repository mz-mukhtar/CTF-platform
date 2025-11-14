-- Migration Script: Convert flag column to flag_hash
-- Run this if you have an existing database with plaintext flags
-- 
-- WARNING: This will hash all existing flags. Make sure you have backups!
-- After running this, you cannot recover the original plaintext flags.

-- Step 1: Add the new flag_hash column
ALTER TABLE `challenges` 
ADD COLUMN `flag_hash` VARCHAR(64) NULL AFTER `points`;

-- Step 2: Hash all existing flags (if any)
-- Note: You'll need to manually hash each flag or use a script
-- Example PHP script to hash existing flags:
-- 
-- <?php
-- require_once 'config.php';
-- $pdo = getDB();
-- $stmt = $pdo->query("SELECT id, flag FROM challenges WHERE flag_hash IS NULL");
-- while ($row = $stmt->fetch()) {
--     $hash = hash('sha256', trim($row['flag']));
--     $update = $pdo->prepare("UPDATE challenges SET flag_hash = ? WHERE id = ?");
--     $update->execute([$hash, $row['id']]);
-- }
-- ?>

-- Step 3: Make flag_hash NOT NULL (after all flags are hashed)
ALTER TABLE `challenges` 
MODIFY COLUMN `flag_hash` VARCHAR(64) NOT NULL;

-- Step 4: Remove the old flag column (optional, for security)
-- ALTER TABLE `challenges` DROP COLUMN `flag`;

-- Note: If you want to keep the flag column for migration purposes,
-- you can leave it but ensure new challenges only use flag_hash

