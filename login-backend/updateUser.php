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
$id = isset($_GET['id']) ? $_GET['id'] : null; // Get the user ID from URL parameter
$user = isset($data['user']) ? $data['user'] : null;
$email = isset($data['email']) ? $data['email'] : null;
$role = isset($data['role']) ? $data['role'] : null;
$user_roleId = isset($data['user_roleId']) ? $data['user_roleId'] : null;
$status = isset($data['status']) ? $data['status'] : null;


// Check if ID is provided and at least one other field is provided
if ($id !== null && ($user !== null || $email !== null || $role !== null || $status !== null|| $user_roleId !== null)) {
    // Prepare SQL statement to update user data
    $sql = "UPDATE user1 SET ";
    $update_fields = array();
    if ($user !== null) {
        $update_fields[] = "user = '$user'";
    }
    if ($email !== null) {
        $update_fields[] = "email = '$email'";
    }
    if ($role !== null) {
        $update_fields[] = "role = '$role'";
    }
    if ($status !== null) {
        $update_fields[] = "status = '$status'";
    }
    if( $user_roleId !== null) {
        $update_fields[] = " user_roleId = ' $user_roleId'";
    }
    $sql .= implode(", ", $update_fields);
    $sql .= " WHERE id = '$id'";

    // Execute SQL statement
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "User updated successfully"));
    } else {
        echo json_encode(array("error" => "Error updating user: " . $conn->error));
    }
} else {
    echo json_encode(array("error" => "ID and at least one other field (user, email, role, status) must be provided."));
}

// Close connection
$conn->close();

?>
