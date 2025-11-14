<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Get all sponsors
if ($method === 'GET' && $action === 'list') {
    $pdo = getDB();
    if (!$pdo) {
        sendResponse(['sponsors' => []]);
    }
    
    $stmt = $pdo->query("SELECT * FROM sponsors ORDER BY display_order ASC");
    $sponsors = $stmt->fetchAll();
    
    sendResponse(['sponsors' => $sponsors]);
}

// Admin: Add sponsor
if ($method === 'POST' && $action === 'add') {
    requireAdmin();
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("
        INSERT INTO sponsors (name, logo_url, website_url, display_order)
        VALUES (?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['name'] ?? '',
        $data['logo_url'] ?? '',
        $data['website_url'] ?? null,
        $data['display_order'] ?? 0
    ]);
    
    sendResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
}

// Admin: Delete sponsor
if ($method === 'DELETE' && $action === 'delete') {
    requireAdmin();
    
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('Sponsor ID required');
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("DELETE FROM sponsors WHERE id = ?");
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

