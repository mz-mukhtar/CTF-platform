<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Get all events
if ($method === 'GET' && $action === 'list') {
    $pdo = getDB();
    if (!$pdo) {
        sendResponse(['events' => []]);
    }
    
    $stmt = $pdo->query("SELECT * FROM events ORDER BY start_date DESC");
    $events = $stmt->fetchAll();
    
    sendResponse(['events' => $events]);
}

// Get active event
if ($method === 'GET' && $action === 'active') {
    $pdo = getDB();
    if (!$pdo) {
        sendResponse(['event' => null]);
    }
    
    $stmt = $pdo->prepare("
        SELECT * FROM events 
        WHERE status = 'active' 
        AND start_date <= NOW() 
        AND end_date >= NOW()
        ORDER BY start_date DESC 
        LIMIT 1
    ");
    $stmt->execute();
    $event = $stmt->fetch();
    
    sendResponse(['event' => $event]);
}

// Admin: Create event
if ($method === 'POST' && $action === 'create') {
    requireAdmin();
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("
        INSERT INTO events (name, description, banner_url, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['name'] ?? '',
        $data['description'] ?? '',
        $data['banner_url'] ?? null,
        $data['start_date'] ?? null,
        $data['end_date'] ?? null,
        $data['status'] ?? 'active'
    ]);
    
    sendResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
}

// Admin: Update event
if ($method === 'PUT' && $action === 'update') {
    requireAdmin();
    
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('Event ID required');
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("
        UPDATE events 
        SET name = ?, description = ?, banner_url = ?, start_date = ?, end_date = ?, status = ?
        WHERE id = ?
    ");
    
    $stmt->execute([
        $data['name'] ?? '',
        $data['description'] ?? '',
        $data['banner_url'] ?? null,
        $data['start_date'] ?? null,
        $data['end_date'] ?? null,
        $data['status'] ?? 'active',
        $id
    ]);
    
    sendResponse(['success' => true]);
}

// Admin: Archive event (move challenges to general area)
if ($method === 'POST' && $action === 'archive') {
    requireAdmin();
    
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('Event ID required');
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    // Update event status
    $stmt = $pdo->prepare("UPDATE events SET status = 'archived' WHERE id = ?");
    $stmt->execute([$id]);
    
    // Move challenges to general area (set event_id to null)
    $stmt = $pdo->prepare("UPDATE challenges SET event_id = NULL WHERE event_id = ?");
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

