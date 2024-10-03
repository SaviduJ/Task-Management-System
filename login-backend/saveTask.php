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
$conn = new mysqli($servername , $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve JSON data from the request body
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// Extract individual data properties
$taskName = isset($data['taskName']) ? $data['taskName'] : '';
$assignee = isset($data['assignee']) ? $data['assignee'] : '';
$dueDate = isset($data['dueDate']) ? $data['dueDate'] : '';
$estimatedTime = isset($data['estimatedTime']) ? $data['estimatedTime'] : '';

$comments = isset($data['comments']) ? $data['comments'] : [];


if ($taskName !== null && $taskName !== '' && $assignee !== null && $assignee !== '' && $dueDate !== null && $dueDate !== '' && $estimatedTime !== null && $estimatedTime !== '') {
    // Prepare SQL statement to insert task data
    $sql = "INSERT INTO asana (taskName, assignee, dueDate, estimatedTime) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("ssss", $taskName, $assignee, $dueDate, $estimatedTime);
        if ($stmt->execute()) {
            // Get the ID of the last inserted task
            $taskID = $conn->insert_id;
            
            // If there are comments, insert them into the comments table
            if (!empty($comments)) {
                // Prepare SQL statement to insert comments
                $commentSql = "INSERT INTO comments (task_id, comment, created_at) VALUES (?, ?, ?)";
                $commentStmt = $conn->prepare($commentSql);
                if ($commentStmt) {
                    foreach ($comments as $comment) {
                        $text = $comment['text'];
                        $timestamp = $comment['timestamp'];
                        $commentStmt->bind_param("iss", $taskID, $text, $timestamp);
                        if (!$commentStmt->execute()) {
                            echo json_encode(array("error" => "Error saving comment: " . $commentStmt->error));
                            $commentStmt->close();
                            break; // Exit loop on error
                        }
                    }
                    // If all comments were successfully inserted
                    if ($commentStmt->errno == 0) {
                        echo json_encode(array("message" => "Task and comments saved successfully"));
                    }
                } else {
                    echo json_encode(array("error" => "Error preparing comment statement: " . $conn->error));
                }
            } else {
                echo json_encode(array("message" => "Task saved successfully"));
            }
        } else {
            echo json_encode(array("error" => "Error saving task: " . $stmt->error));
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Error preparing task statement: " . $conn->error));
    }
}

// Close connection
$conn->close();




?>