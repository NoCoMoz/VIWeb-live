<?php
/**
 * BlueSky API Proxy
 * 
 * This PHP script serves as a proxy for the BlueSky API,
 * returning fallback posts when deployed on a PHP-only hosting environment.
 */

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Get query parameters
$handle = isset($_GET['handle']) ? $_GET['handle'] : 'voicesignited.bsky.social';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5;

// Validate limit (between 1 and 20)
$limit = max(1, min(20, $limit));

// Function to get fallback posts
function getFallbackPosts($handle) {
    $currentTime = time();
    
    return json_encode([
        [
            'id' => 'fallback-1',
            'text' => 'Welcome to Voices Ignited! We are a movement dedicated to fighting corruption and greed in our government.',
            'createdAt' => date('c', $currentTime),
            'author' => [
                'handle' => $handle,
                'displayName' => 'Voices Ignited',
                'avatar' => '/images/white-logo.76c7025e.png'
            ],
            'images' => [],
            'likes' => 42,
            'reposts' => 15,
            'replies' => 7,
            'url' => "https://bsky.app/profile/{$handle}"
        ],
        [
            'id' => 'fallback-2',
            'text' => 'Join us in our mission to create a more transparent and accountable government. Together, we can make a difference!',
            'createdAt' => date('c', $currentTime - 86400),
            'author' => [
                'handle' => $handle,
                'displayName' => 'Voices Ignited',
                'avatar' => '/images/white-logo.76c7025e.png'
            ],
            'images' => [],
            'likes' => 38,
            'reposts' => 12,
            'replies' => 5,
            'url' => "https://bsky.app/profile/{$handle}"
        ]
    ]);
}

// Return fallback posts
echo getFallbackPosts($handle);
