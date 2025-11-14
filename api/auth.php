<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
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
    
    // Check regular users (from localStorage for now, or DB)
    $pdo = getDB();
    if ($pdo) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
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

sendError('Invalid action', 400);

