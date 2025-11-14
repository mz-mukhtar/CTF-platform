<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Get all challenges
if ($method === 'GET' && $action === 'list') {
    $pdo = getDB();
    if (!$pdo) {
        // Fallback to JSON file for development
        $challenges = json_decode(file_get_contents('../data/challenges.json'), true) ?? [];
        sendResponse(['challenges' => $challenges]);
    }
    
    $eventId = $_GET['event_id'] ?? null;
    $category = $_GET['category'] ?? null;
    $difficulty = $_GET['difficulty'] ?? null;
    $status = $_GET['status'] ?? 'active'; // active, disabled, all
    
    $sql = "SELECT * FROM challenges WHERE 1=1";
    $params = [];
    
    if ($eventId) {
        $sql .= " AND event_id = ?";
        $params[] = $eventId;
    }
    
    if ($category) {
        $sql .= " AND category = ?";
        $params[] = $category;
    }
    
    if ($difficulty) {
        $sql .= " AND difficulty = ?";
        $params[] = $difficulty;
    }
    
    if ($status !== 'all') {
        $sql .= " AND status = ?";
        $params[] = $status;
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $challenges = $stmt->fetchAll();
    
    sendResponse(['challenges' => $challenges]);
}

// Get single challenge
if ($method === 'GET' && $action === 'get') {
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('Challenge ID required');
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("SELECT * FROM challenges WHERE id = ?");
    $stmt->execute([$id]);
    $challenge = $stmt->fetch();
    
    if (!$challenge) sendError('Challenge not found', 404);
    
    sendResponse(['challenge' => $challenge]);
}

// Admin: Add challenge
if ($method === 'POST' && $action === 'add') {
    requireAdmin();
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("
        INSERT INTO challenges (title, description, category, difficulty, points, flag, files, challenge_link, event_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['title'] ?? '',
        $data['description'] ?? '',
        $data['category'] ?? '',
        $data['difficulty'] ?? '',
        $data['points'] ?? 0,
        $data['flag'] ?? '',
        json_encode($data['files'] ?? []),
        $data['challenge_link'] ?? null,
        $data['event_id'] ?? null,
        $data['status'] ?? 'active'
    ]);
    
    sendResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
}

// Admin: Update challenge
if ($method === 'PUT' && $action === 'update') {
    requireAdmin();
    
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('Challenge ID required');
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("
        UPDATE challenges 
        SET title = ?, description = ?, category = ?, difficulty = ?, points = ?, 
            flag = ?, files = ?, challenge_link = ?, event_id = ?, status = ?
        WHERE id = ?
    ");
    
    $stmt->execute([
        $data['title'] ?? '',
        $data['description'] ?? '',
        $data['category'] ?? '',
        $data['difficulty'] ?? '',
        $data['points'] ?? 0,
        $data['flag'] ?? '',
        json_encode($data['files'] ?? []),
        $data['challenge_link'] ?? null,
        $data['event_id'] ?? null,
        $data['status'] ?? 'active',
        $id
    ]);
    
    sendResponse(['success' => true]);
}

// Admin: Delete challenge
if ($method === 'DELETE' && $action === 'delete') {
    requireAdmin();
    
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('Challenge ID required');
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("DELETE FROM challenges WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse(['success' => true]);
}

function requireAdmin() {
    $email = $_SERVER['HTTP_X_ADMIN_EMAIL'] ?? '';
    if (!isAdmin($email)) {
        sendError('Admin access required', 403);
    }
}

sendError('Invalid action', 400);

