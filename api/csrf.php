<?php
require_once 'config.php';

// Start session for CSRF tokens
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');

// Generate CSRF token
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = generateCSRFToken();
    sendResponse(['token' => $token]);
}

sendError('Invalid request', 400);

