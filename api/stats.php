<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    sendError('Method not allowed', 405);
}

requireAdmin();

$pdo = getDB();
if (!$pdo) {
    sendResponse([
        'users' => ['total' => 0, 'active' => 0, 'banned' => 0, 'admins' => 0],
        'challenges' => ['total' => 0, 'active' => 0, 'disabled' => 0],
        'events' => ['total' => 0, 'active' => 0, 'archived' => 0],
        'flags' => ['total' => 0, 'correct' => 0],
    ]);
}

try {
    // User statistics
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = $stmt->fetch()['total'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as active FROM users WHERE is_banned = FALSE");
    $activeUsers = $stmt->fetch()['active'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as banned FROM users WHERE is_banned = TRUE");
    $bannedUsers = $stmt->fetch()['banned'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as admins FROM users WHERE role = 'admin'");
    $adminUsers = $stmt->fetch()['admins'];
    
    // Challenge statistics
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM challenges");
    $totalChallenges = $stmt->fetch()['total'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as active FROM challenges WHERE status = 'active'");
    $activeChallenges = $stmt->fetch()['active'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as disabled FROM challenges WHERE status = 'disabled'");
    $disabledChallenges = $stmt->fetch()['disabled'];
    
    // Event statistics
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM events");
    $totalEvents = $stmt->fetch()['total'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as active FROM events WHERE status = 'active'");
    $activeEvents = $stmt->fetch()['active'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as archived FROM events WHERE status = 'archived'");
    $archivedEvents = $stmt->fetch()['archived'];
    
    // Flag submission statistics
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM submitted_flags");
    $totalFlags = $stmt->fetch()['total'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as correct FROM submitted_flags WHERE is_correct = TRUE");
    $correctFlags = $stmt->fetch()['correct'];
    
    sendResponse([
        'users' => [
            'total' => (int)$totalUsers,
            'active' => (int)$activeUsers,
            'banned' => (int)$bannedUsers,
            'admins' => (int)$adminUsers,
        ],
        'challenges' => [
            'total' => (int)$totalChallenges,
            'active' => (int)$activeChallenges,
            'disabled' => (int)$disabledChallenges,
        ],
        'events' => [
            'total' => (int)$totalEvents,
            'active' => (int)$activeEvents,
            'archived' => (int)$archivedEvents,
        ],
        'flags' => [
            'total' => (int)$totalFlags,
            'correct' => (int)$correctFlags,
        ],
    ]);
} catch (Exception $e) {
    sendError('Failed to fetch statistics', 500);
}

