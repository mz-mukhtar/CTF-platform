<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    sendError('Method not allowed', 405);
}

// Rate limiting for flag submissions
$clientId = getClientIdentifier();
if (!checkRateLimit($clientId . '_flags', 30, 60)) {
    sendError('Too many flag submissions. Please try again later.', 429);
}

$data = json_decode(file_get_contents('php://input'), true);

// CSRF protection
$csrfToken = $data['csrf_token'] ?? '';
if (!validateCSRFToken($csrfToken)) {
    sendError('Invalid CSRF token', 403);
}

$challengeId = sanitizeInput($data['challenge_id'] ?? '');
$submittedFlag = $data['flag'] ?? '';
$userId = sanitizeInput($data['user_id'] ?? '');

if (!$challengeId || !$submittedFlag || !$userId) {
    sendError('Missing required fields', 400);
}

$pdo = getDB();
if (!$pdo) {
    // Fallback to localStorage-based check for development
    sendResponse(['correct' => false, 'message' => 'Database not available']);
}

try {
    // Get challenge flag hash
    $stmt = $pdo->prepare("SELECT flag_hash, points FROM challenges WHERE id = ?");
    $stmt->execute([$challengeId]);
    $challenge = $stmt->fetch();
    
    if (!$challenge) {
        sendError('Challenge not found', 404);
    }
    
    // Hash the submitted flag
    $submittedFlagHash = hashFlag($submittedFlag);
    
    // Compare hashes
    $isCorrect = hash_equals($challenge['flag_hash'], $submittedFlagHash);
    
    // Check if user already solved this challenge
    $stmt = $pdo->prepare("
        SELECT id, is_correct FROM submitted_flags 
        WHERE user_id = ? AND challenge_id = ?
    ");
    $stmt->execute([$userId, $challengeId]);
    $existingSubmission = $stmt->fetch();
    
    if ($existingSubmission) {
        // Already submitted
        sendResponse([
            'correct' => $existingSubmission['is_correct'] == 1,
            'message' => $existingSubmission['is_correct'] == 1 ? 'Already solved' : 'Incorrect flag',
            'already_solved' => $existingSubmission['is_correct'] == 1
        ]);
    }
    
    // Record submission
    $stmt = $pdo->prepare("
        INSERT INTO submitted_flags (user_id, challenge_id, flag, is_correct)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$userId, $challengeId, $submittedFlag, $isCorrect ? 1 : 0]);
    
    if ($isCorrect) {
        // Update user points and solved count
        $stmt = $pdo->prepare("
            UPDATE users 
            SET total_points = total_points + ?, 
                challenges_solved = challenges_solved + 1
            WHERE id = ?
        ");
        $stmt->execute([$challenge['points'], $userId]);
        
        sendResponse([
            'correct' => true,
            'message' => 'Correct flag!',
            'points' => $challenge['points']
        ]);
    } else {
        sendResponse([
            'correct' => false,
            'message' => 'Incorrect flag'
        ]);
    }
} catch (PDOException $e) {
    sendError('Failed to process flag submission', 500);
} catch (Exception $e) {
    sendError('Failed to process flag submission', 500);
}

