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

// Get single event
if ($method === 'GET' && $action === 'get') {
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('Event ID required');
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
    $stmt->execute([$id]);
    $event = $stmt->fetch();
    
    if (!$event) sendError('Event not found', 404);
    
    sendResponse(['event' => $event]);
}

// Get event scoreboard
if ($method === 'GET' && $action === 'scoreboard') {
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('Event ID required');
    
    $pdo = getDB();
    if (!$pdo) {
        sendResponse(['leaderboard' => []]);
    }
    
    // Get users who solved challenges from this event
    $stmt = $pdo->prepare("
        SELECT 
            u.id,
            u.name,
            u.email,
            COALESCE(SUM(c.points), 0) as total_points,
            COUNT(DISTINCT sf.challenge_id) as challenges_solved
        FROM users u
        LEFT JOIN submitted_flags sf ON u.id = sf.user_id AND sf.is_correct = 1
        LEFT JOIN challenges c ON sf.challenge_id = c.id AND c.event_id = ?
        GROUP BY u.id, u.name, u.email
        HAVING challenges_solved > 0 OR total_points > 0
        ORDER BY total_points DESC, challenges_solved DESC
    ");
    $stmt->execute([$id]);
    $users = $stmt->fetchAll();
    
    $leaderboard = [];
    $rank = 1;
    foreach ($users as $user) {
        $leaderboard[] = [
            'rank' => $rank++,
            'username' => $user['name'],
            'points' => (int)$user['total_points'],
            'solved' => (int)$user['challenges_solved'],
        ];
    }
    
    sendResponse(['leaderboard' => $leaderboard]);
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

// Admin: Delete event
if ($method === 'DELETE' && $action === 'delete') {
    requireAdmin();
    
    $id = $_GET['id'] ?? '';
    if (!$id) sendError('Event ID required');
    
    $pdo = getDB();
    if (!$pdo) sendError('Database not available');
    
    // Check if event has challenges
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM challenges WHERE event_id = ?");
    $stmt->execute([$id]);
    $count = $stmt->fetchColumn();
    
    if ($count > 0) {
        sendError('Cannot delete event: it has associated challenges. Archive it instead.', 400);
    }
    
    $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
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

