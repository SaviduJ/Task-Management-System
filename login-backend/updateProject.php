<?php

// Allow requests from localhost:3000 (replace with your frontend URL if different)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$conn = mysqli_connect("localhost", "root", "", "asana");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch and decode JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate and sanitize input (optional step depending on your application's requirements)

// Extract data
$id = $data['id'];
$projectname = $data['projectname'];

// Update project name in the database
$sql = "UPDATE projects SET projectname = '$projectname' WHERE id = $id";

if (mysqli_query($conn, $sql)) {
    // On success
    $response = array(
        "success" => true,
        "message" => "Project name updated successfully"
    );
} else {
    // On failure
    $response = array(
        "success" => false,
        "error" => mysqli_error($conn)
    );
}

// Close database connection
mysqli_close($conn);

// Return JSON response
echo json_encode($response);
?>
