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
        SELECT id, name, email, role, is_banned, banned_at, total_points, challenges_solved, created_at 
        FROM users 
        ORDER BY total_points DESC, challenges_solved DESC
    ");
    $users = $stmt->fetchAll();
    
    sendResponse(['users' => $users]);
}

// Admin: Add new user
if ($method === 'POST' && $action === 'add') {
    requireAdmin();
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    // CSRF protection
    $csrfToken = $data['csrf_token'] ?? '';
    if (!validateCSRFToken($csrfToken)) {
        sendError('Invalid CSRF token', 403);
    }
    
    $name = sanitizeInput($data['name'] ?? '');
    $email = sanitizeInput($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $role = sanitizeInput($data['role'] ?? 'user');
    
    if (empty($name) || empty($email) || empty($password)) {
        sendError('Name, email, and password are required', 400);
    }
    
    if (!in_array($role, ['user', 'admin'])) {
        $role = 'user';
    }
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    try {
        $hashedPassword = hashPassword($password);
        $stmt = $pdo->prepare("
            INSERT INTO users (name, email, password, role) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$name, $email, $hashedPassword, $role]);
        
        sendResponse(['success' => true, 'user_id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            sendError('Email already exists', 400);
        }
        sendError('Failed to create user', 500);
    }
}

// Admin: Ban/Unban user
if ($method === 'POST' && $action === 'ban') {
    try {
        requireAdmin();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // CSRF protection
        $csrfToken = $data['csrf_token'] ?? '';
        if (!validateCSRFToken($csrfToken)) {
            sendError('Invalid CSRF token', 403);
        }
        
        $id = intval($data['id'] ?? 0);
        $isBanned = isset($data['is_banned']) ? (bool)$data['is_banned'] : true;
        
        if (!$id) sendError('User ID required', 400);
        
        $pdo = getDB();
        if (!$pdo) sendError('Database not available');
        
        $bannedAt = $isBanned ? date('Y-m-d H:i:s') : null;
        
        $stmt = $pdo->prepare("
            UPDATE users 
            SET is_banned = ?, banned_at = ? 
            WHERE id = ?
        ");
        $stmt->execute([$isBanned ? 1 : 0, $bannedAt, $id]);
        
        sendResponse(['success' => true]);
    } catch (Exception $e) {
        sendError('Failed to update user status', 500);
    }
}

// Admin: Make user admin
if ($method === 'POST' && $action === 'makeAdmin') {
    try {
        requireAdmin();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // CSRF protection
        $csrfToken = $data['csrf_token'] ?? '';
        if (!validateCSRFToken($csrfToken)) {
            sendError('Invalid CSRF token', 403);
        }
        
        $id = intval($data['id'] ?? 0);
        $makeAdmin = isset($data['make_admin']) ? (bool)$data['make_admin'] : true;
        
        if (!$id) sendError('User ID required', 400);
        
        $pdo = getDB();
        if (!$pdo) sendError('Database not available');
        
        $role = $makeAdmin ? 'admin' : 'user';
        
        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$role, $id]);
        
        sendResponse(['success' => true]);
    } catch (Exception $e) {
        sendError('Failed to update user role', 500);
    }
}

// Admin: Delete user
if ($method === 'DELETE' && $action === 'delete') {
    try {
        requireAdmin();
        
        $id = $_GET['id'] ?? '';
        if (!$id) sendError('User ID required');
        
        $pdo = getDB();
        if (!$pdo) sendError('Database not available');
        
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        
        sendResponse(['success' => true]);
    } catch (Exception $e) {
        sendError('Failed to delete user', 500);
    }
}

// Admin: Get submitted flags
if ($method === 'GET' && $action === 'flags') {
    try {
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
    } catch (Exception $e) {
        sendError('Failed to fetch flags', 500);
    }
}

// Admin: Reset event (clear all submissions)
if ($method === 'POST' && $action === 'reset') {
    try {
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
    } catch (Exception $e) {
        sendError('Failed to reset event', 500);
    }
}

function requireAdmin() {
    $email = $_SERVER['HTTP_X_ADMIN_EMAIL'] ?? '';
    if (!isAdmin($email)) {
        sendError('Admin access required', 403);
    }
}

sendError('Invalid action', 400);

