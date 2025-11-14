<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Rate limiting for auth endpoints
$clientId = getClientIdentifier();
if (!checkRateLimit($clientId, 5, 60)) {
    sendError('Too many requests. Please try again later.', 429);
}

if ($method === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // CSRF protection
    $csrfToken = $data['csrf_token'] ?? '';
    if (!validateCSRFToken($csrfToken)) {
        sendError('Invalid CSRF token', 403);
    }
    
    $email = sanitizeInput($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        sendError('Email and password are required', 400);
    }
    
    // Check if admin
    if ($email === ADMIN_EMAIL && $password === ADMIN_PASSWORD) {
        sendResponse([
            'success' => true,
            'isAdmin' => true,
            'user' => [
                'id' => 'admin',
                'name' => 'Admin',
                'email' => ADMIN_EMAIL,
            ]
        ]);
    }
    
    // Check regular users from database
    $pdo = getDB();
    if ($pdo) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && verifyPassword($password, $user['password'])) {
            unset($user['password']);
            sendResponse([
                'success' => true,
                'isAdmin' => false,
                'user' => $user
            ]);
        }
    }
    
    sendError('Invalid credentials', 401);
}

if ($method === 'POST' && $action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // CSRF protection
    $csrfToken = $data['csrf_token'] ?? '';
    if (!validateCSRFToken($csrfToken)) {
        sendError('Invalid CSRF token', 403);
    }
    
    $name = sanitizeInput($data['name'] ?? '');
    $email = sanitizeInput($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    if (empty($name) || empty($email) || empty($password)) {
        sendError('All fields are required', 400);
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendError('Invalid email format', 400);
    }
    
    // Validate password strength
    if (strlen($password) < 8) {
        sendError('Password must be at least 8 characters long', 400);
    }
    
    $pdo = getDB();
    if (!$pdo) {
        sendError('Database not available', 500);
    }
    
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendError('Email already registered', 409);
    }
    
    // Hash password with bcrypt
    $hashedPassword = hashPassword($password);
    
    // Insert new user
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password, total_points, challenges_solved)
        VALUES (?, ?, ?, 0, 0)
    ");
    
    try {
        $stmt->execute([$name, $email, $hashedPassword]);
        $userId = $pdo->lastInsertId();
        
        sendResponse([
            'success' => true,
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'totalPoints' => 0,
                'challengesSolved' => 0,
            ]
        ]);
    } catch (PDOException $e) {
        sendError('Registration failed', 500);
    }
}

sendError('Invalid action', 400);
