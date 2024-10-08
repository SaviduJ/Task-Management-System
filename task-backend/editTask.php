<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
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
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}

// Retrieve JSON data from the request body
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// Extract individual data properties
$id = isset($_GET['id']) ? $_GET['id'] : null; // Get the task ID from URL parameter
$taskName = isset($data['taskName']) ? $data['taskName'] : null;
$assignee = isset($data['assignee']) ? $data['assignee'] : null;
$dueDate = isset($data['dueDate']) ? $data['dueDate'] : null;
$estimatedTime = isset($data['estimatedTime']) ? $data['estimatedTime'] : null;

// Check if ID is provided and at least one other field is provided
if ($id !== null && ($taskName !== null || $assignee !== null || $dueDate !== null || $estimatedTime !== null)) {
    // Prepare SQL statement to update task data
    $sql = "UPDATE asana SET ";
    $update_fields = array();
    if ($taskName !== null) {
        $update_fields[] = "taskName = '$taskName'";
    }
    if ($assignee !== null) {
        $update_fields[] = "assignee = '$assignee'";
    }
    if ($dueDate !== null) {
        $update_fields[] = "dueDate = '$dueDate'";
    }
    if ($estimatedTime !== null) {
        $update_fields[] = "estimatedTime = '$estimatedTime'";
    }
    $sql .= implode(", ", $update_fields);
    $sql .= " WHERE id = '$id'";

    // Execute SQL statement
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "Task updated successfully"));
    } else {
        echo json_encode(array("error" => "Error updating task: " . $conn->error));
    }
} else {
    echo json_encode(array("error" => "ID and at least one other field (taskName, assignee, dueDate, estimatedTime) must be provided."));
}

// Close connection
$conn->close();

?>
