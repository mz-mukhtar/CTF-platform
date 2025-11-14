<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Get all challenges
if ($method === 'GET' && $action === 'list') {
    $pdo = getDB();
    if (!$pdo) {
        // Return empty array instead of exposing file paths
        sendResponse(['challenges' => []]);
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
    try {
        requireAdmin();
        
        // CSRF protection
        $data = json_decode(file_get_contents('php://input'), true);
        $csrfToken = $data['csrf_token'] ?? '';
        if (!validateCSRFToken($csrfToken)) {
            sendError('Invalid CSRF token', 403);
        }
        
        // Rate limiting
        $clientId = getClientIdentifier();
        if (!checkRateLimit($clientId . '_admin', 20, 60)) {
            sendError('Too many requests. Please try again later.', 429);
        }
        
        // Sanitize inputs
        $title = sanitizeInput($data['title'] ?? '');
        $description = sanitizeInput($data['description'] ?? '');
        $category = sanitizeInput($data['category'] ?? '');
        $difficulty = sanitizeInput($data['difficulty'] ?? '');
        $points = intval($data['points'] ?? 0);
        $flag = $data['flag'] ?? '';
        
        if (empty($title) || empty($flag)) {
            sendError('Title and flag are required', 400);
        }
        
        $pdo = getDB();
        if (!$pdo) sendError('Database not available');
        
        // Hash the flag before storing
        $flagHash = hashFlag($flag);
        
        $stmt = $pdo->prepare("
            INSERT INTO challenges (title, description, category, difficulty, points, flag_hash, files, challenge_link, event_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $title,
            $description,
            $category,
            $difficulty,
            $points,
            $flagHash,
            json_encode($data['files'] ?? []),
            $data['challenge_link'] ?? null,
            $data['event_id'] ?? null,
            $data['status'] ?? 'active'
        ]);
        
        sendResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        sendError('Failed to create challenge', 500);
    }
}

// Admin: Update challenge
if ($method === 'PUT' && $action === 'update') {
    try {
        requireAdmin();
        
        $id = $_GET['id'] ?? '';
        if (!$id) sendError('Challenge ID required');
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        $pdo = getDB();
        if (!$pdo) sendError('Database not available');
        
        // Hash the flag before storing (if provided)
        $flagHash = isset($data['flag']) ? hashFlag($data['flag']) : null;
        
        if ($flagHash) {
            $stmt = $pdo->prepare("
                UPDATE challenges 
                SET title = ?, description = ?, category = ?, difficulty = ?, points = ?, 
                    flag_hash = ?, files = ?, challenge_link = ?, event_id = ?, status = ?
                WHERE id = ?
            ");
            
            $stmt->execute([
                $data['title'] ?? '',
                $data['description'] ?? '',
                $data['category'] ?? '',
                $data['difficulty'] ?? '',
                $data['points'] ?? 0,
                $flagHash,
                json_encode($data['files'] ?? []),
                $data['challenge_link'] ?? null,
                $data['event_id'] ?? null,
                $data['status'] ?? 'active',
                $id
            ]);
        } else {
            // Update without changing flag
            $stmt = $pdo->prepare("
                UPDATE challenges 
                SET title = ?, description = ?, category = ?, difficulty = ?, points = ?, 
                    files = ?, challenge_link = ?, event_id = ?, status = ?
                WHERE id = ?
            ");
            
            $stmt->execute([
                $data['title'] ?? '',
                $data['description'] ?? '',
                $data['category'] ?? '',
                $data['difficulty'] ?? '',
                $data['points'] ?? 0,
                json_encode($data['files'] ?? []),
                $data['challenge_link'] ?? null,
                $data['event_id'] ?? null,
                $data['status'] ?? 'active',
                $id
            ]);
        }
        
        sendResponse(['success' => true]);
    } catch (Exception $e) {
        sendError('Failed to update challenge', 500);
    }
}

// Admin: Delete challenge
if ($method === 'DELETE' && $action === 'delete') {
    try {
        requireAdmin();
        
        $id = $_GET['id'] ?? '';
        if (!$id) sendError('Challenge ID required');
        
        $pdo = getDB();
        if (!$pdo) sendError('Database not available');
        
        $stmt = $pdo->prepare("DELETE FROM challenges WHERE id = ?");
        $stmt->execute([$id]);
        
        sendResponse(['success' => true]);
    } catch (Exception $e) {
        sendError('Failed to delete challenge', 500);
    }
}

function requireAdmin() {
    $email = $_SERVER['HTTP_X_ADMIN_EMAIL'] ?? '';
    if (!isAdmin($email)) {
        sendError('Admin access required', 403);
    }
}

sendError('Invalid action', 400);

