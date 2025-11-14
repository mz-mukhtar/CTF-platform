<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Admin: Get all users
if ($method === 'GET' && $action === 'list') {
    requireAdmin();
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->query("
        SELECT id, name, email, total_points, challenges_solved, created_at 
        FROM users 
        ORDER BY total_points DESC, challenges_solved DESC
    ");
    $users = $stmt->fetchAll();
    
    sendResponse(['users' => $users]);
}

// Admin: Delete user
if ($method === 'DELETE' && $action === 'delete') {
    requireAdmin();
    
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('User ID required');
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse(['success' => true]);
}

// Admin: Get submitted flags
if ($method === 'GET' && $action === 'flags') {
    requireAdmin();
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $challengeId = $_GET['challenge_id'] ?? null;
    
    $sql = "SELECT sf.*, u.name as user_name, c.title as challenge_title 
            FROM submitted_flags sf
            JOIN users u ON sf.user_id = u.id
            JOIN challenges c ON sf.challenge_id = c.id
            WHERE 1=1";
    $params = [];
    
    if ($challengeId) {
        $sql .= " AND sf.challenge_id = ?";
        $params[] = $challengeId;
    }
    
    $sql .= " ORDER BY sf.submitted_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $flags = $stmt->fetchAll();
    
    sendResponse(['flags' => $flags]);
}

// Admin: Reset event (clear all submissions)
if ($method === 'POST' && $action === 'reset') {
    requireAdmin();
    
    $eventId = $_GET['event_id'] ?? null;
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    if ($eventId) {
        // Reset specific event
        $stmt = $pdo->prepare("
            DELETE sf FROM submitted_flags sf
            JOIN challenges c ON sf.challenge_id = c.id
            WHERE c.event_id = ?
        ");
        $stmt->execute([$eventId]);
        
        $stmt = $pdo->prepare("
            UPDATE users SET total_points = 0, challenges_solved = 0
        ");
        $stmt->execute();
    } else {
        // Reset all
        $pdo->exec("DELETE FROM submitted_flags");
        $pdo->exec("UPDATE users SET total_points = 0, challenges_solved = 0");
    }
    
    sendResponse(['success' => true]);
}

function requireAdmin() {
    $email = $_SERVER['HTTP_X_ADMIN_EMAIL'] ?? '';
    if (!isAdmin($email)) {
        sendError('Admin access required', 403);
    }
}

sendError('Invalid action', 400);

