<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'ctf_platform');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');

// Admin credentials (change these!)
define('ADMIN_EMAIL', 'admin@cybervanguard.com');
define('ADMIN_PASSWORD', 'admin123'); // Change this in production!

// Flag format
define('FLAG_FORMAT', 'cvctf{');

// Connect to database
function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        // For development, return null if DB not set up
        return null;
    }
}

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Helper function to check if user is admin
function isAdmin($email) {
    return $email === ADMIN_EMAIL;
}

// Helper function to send JSON response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

// Helper function to send error
function sendError($message, $statusCode = 400) {
    sendResponse(['error' => $message], $statusCode);
}

