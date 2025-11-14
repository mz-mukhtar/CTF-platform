<?php
/**
 * Cron job for automatic event archiving
 * Run this script periodically (e.g., every hour) via cPanel cron jobs
 * 
 * Setup in cPanel:
 * 1. Go to Cron Jobs
 * 2. Add: 0 * * * * /usr/bin/php /path/to/your/api/cron.php
 * (This runs every hour)
 */

require_once 'config.php';

$pdo = getDB();
if (!$pdo) {
    error_log('CTF Platform: Database not available for cron job');
    exit(1);
}

// Find events that have ended but are still marked as active
$stmt = $pdo->prepare("
    SELECT id, name, end_date 
    FROM events 
    WHERE status = 'active' 
    AND end_date < NOW()
");

$stmt->execute();
$expiredEvents = $stmt->fetchAll();

foreach ($expiredEvents as $event) {
    // Archive the event
    $archiveStmt = $pdo->prepare("UPDATE events SET status = 'archived' WHERE id = ?");
    $archiveStmt->execute([$event['id']]);
    
    // Move challenges to general area (set event_id to null)
    $challengeStmt = $pdo->prepare("UPDATE challenges SET event_id = NULL WHERE event_id = ?");
    $challengeStmt->execute([$event['id']]);
    
    error_log("CTF Platform: Event '{$event['name']}' (ID: {$event['id']}) has been automatically archived");
}

if (count($expiredEvents) > 0) {
    error_log("CTF Platform: Archived " . count($expiredEvents) . " expired event(s)");
} else {
    error_log("CTF Platform: No events to archive");
}

exit(0);

