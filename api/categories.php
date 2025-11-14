<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Get all categories
if ($method === 'GET' && $action === 'list') {
    $pdo = getDB();
    if (!$pdo) {
        sendResponse(['categories' => []]);
    }
    
    $stmt = $pdo->query("SELECT * FROM categories ORDER BY name ASC");
    $categories = $stmt->fetchAll();
    
    sendResponse(['categories' => $categories]);
}

// Admin: Add category
if ($method === 'POST' && $action === 'add') {
    try {
        requireAdmin();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        $pdo = getDB();
        if (!$pdo) sendError('Database not available');
        
        $stmt = $pdo->prepare("
            INSERT INTO categories (name, description)
            VALUES (?, ?)
        ");
        
        $stmt->execute([
            $data['name'] ?? '',
            $data['description'] ?? null
        ]);
        
        sendResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        sendError('Failed to create category', 500);
    }
}

// Admin: Update category
if ($method === 'PUT' && $action === 'update') {
    try {
        requireAdmin();
        
        $id = $_GET['id'] ?? '';
        if (!$id) sendError('Category ID required');
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        $pdo = getDB();
        if (!$pdo) sendError('Database not available');
        
        $stmt = $pdo->prepare("
            UPDATE categories 
            SET name = ?, description = ?
            WHERE id = ?
        ");
        
        $stmt->execute([
            $data['name'] ?? '',
            $data['description'] ?? null,
            $id
        ]);
        
        sendResponse(['success' => true]);
    } catch (Exception $e) {
        sendError('Failed to update category', 500);
    }
}

// Admin: Delete category
if ($method === 'DELETE' && $action === 'delete') {
    try {
        requireAdmin();
        
        $id = $_GET['id'] ?? '';
        if (!$id) sendError('Category ID required');
        
        $pdo = getDB();
        if (!$pdo) sendError('Database not available');
        
        // Check if category is used by challenges
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM challenges WHERE category = (SELECT name FROM categories WHERE id = ?)");
        $stmt->execute([$id]);
        $count = $stmt->fetchColumn();
        
        if ($count > 0) {
            sendError('Cannot delete category: it is used by challenges', 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        
        sendResponse(['success' => true]);
    } catch (Exception $e) {
        sendError('Failed to delete category', 500);
    }
}

function requireAdmin() {
    $email = $_SERVER['HTTP_X_ADMIN_EMAIL'] ?? '';
    if (!isAdmin($email)) {
        sendError('Admin access required', 403);
    }
}

sendError('Invalid action', 400);

