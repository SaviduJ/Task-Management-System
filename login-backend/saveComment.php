<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection parameters
$servername = "127.0.0.1"; // Update with your MySQL server address
$port = "3308"; // Update with your MySQL port if different
$username = "root"; // Update with your MySQL username
$password = ""; // Update with your MySQL password
$database = "asana"; // Update with your MySQL database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve JSON data from the request body
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// Extract individual data properties
$taskId = isset($data['taskId']) ? $data['taskId'] : '';
$comment = isset($data['comment']) ? $data['comment'] : '';

if ($taskId !== '' && $comment !== '') {
    // Prepare SQL statement to insert comment data
    $sql = "INSERT INTO comments (task_id, comment, created_at) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("iss", $taskId, $comment['text'],$comment['timestamp']);
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Comment saved successfully"));
        } else {
            echo json_encode(array("error" => "Error: " . $stmt->error));
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Error: " . $conn->error));
    }
} else {
    echo json_encode(array("error" => "Incomplete data received"));
}

// Close connection
$conn->close();

?>