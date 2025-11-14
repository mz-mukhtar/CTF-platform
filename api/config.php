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
    if (empty($email)) {
        return false;
    }
    
    // Check against configured admin email
    if ($email === ADMIN_EMAIL) {
        return true;
    }
    
    // Also check database for admin role
    try {
        $pdo = getDB();
        if ($pdo) {
            $stmt = $pdo->prepare("SELECT role FROM users WHERE email = ? AND is_banned = FALSE");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            if ($user && $user['role'] === 'admin') {
                return true;
            }
        }
    } catch (Exception $e) {
        // Silently fail and fall back to email check
    }
    
    return false;
}

// Helper function to send JSON response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

// Helper function to send error (sanitized for security)
function sendError($message, $statusCode = 400) {
    // Sanitize error messages to prevent information leakage
    $sanitizedMessage = 'An error occurred';
    
    // Only show specific errors for known safe messages
    $safeMessages = [
        'Invalid credentials',
        'Email and password are required',
        'Invalid CSRF token',
        'Admin access required',
        'Too many requests',
        'Missing required fields',
        'Invalid action',
        'Challenge not found',
        'Event not found',
        'User not found',
        'Database not available'
    ];
    
    // Check if message is in safe list
    foreach ($safeMessages as $safe) {
        if (stripos($message, $safe) !== false) {
            $sanitizedMessage = $message;
            break;
        }
    }
    
    // Remove any file paths or sensitive information
    $sanitizedMessage = preg_replace('/\.\.\/[^\s]+/', '[path removed]', $sanitizedMessage);
    $sanitizedMessage = preg_replace('/\/[^\s]+\.(php|json|sql|log)/i', '[file removed]', $sanitizedMessage);
    
    sendResponse(['error' => $sanitizedMessage], $statusCode);
}

// Helper function to hash flag using SHA-256
function hashFlag($flag) {
    return hash('sha256', trim($flag));
}

// Helper function to hash password using bcrypt
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

// Helper function to verify password
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// CSRF Protection
function generateCSRFToken() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $token;
    return $token;
}

function validateCSRFToken($token) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

// Input sanitization
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Rate limiting (simple in-memory implementation)
$rateLimitStore = [];
function checkRateLimit($identifier, $maxRequests = 10, $windowSeconds = 60) {
    global $rateLimitStore;
    $now = time();
    $key = $identifier;
    
    if (!isset($rateLimitStore[$key])) {
        $rateLimitStore[$key] = [];
    }
    
    // Remove old entries
    $rateLimitStore[$key] = array_filter($rateLimitStore[$key], function($timestamp) use ($now, $windowSeconds) {
        return ($now - $timestamp) < $windowSeconds;
    });
    
    // Check limit
    if (count($rateLimitStore[$key]) >= $maxRequests) {
        return false;
    }
    
    // Add current request
    $rateLimitStore[$key][] = $now;
    return true;
}

function getClientIdentifier() {
    return $_SERVER['REMOTE_ADDR'] . '_' . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown');
}

