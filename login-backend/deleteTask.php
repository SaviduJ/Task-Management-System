<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE"); // Allow DELETE method
header("Content-Type: application/json");

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

// Retrieve task ID from the request URL
$id = isset($_GET['id']) ? $_GET['id'] : null;

// Check if task ID is provided
if ($id !== null) {
    // Prepare SQL statement to delete task
    $sql = "DELETE FROM asana WHERE id = '$id'";

    // Execute SQL statement
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "Task deleted successfully"));
    } else {
        echo json_encode(array("error" => "Error deleting task: " . $conn->error));
    }
} else {
    echo json_encode(array("error" => "Task ID must be provided"));
}

// Close connection
$conn->close();
?>
