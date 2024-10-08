<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

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

// Perform database query to retrieve sections
$sql = "SELECT * FROM sections";
$result = $conn->query($sql);

$response = array(); // Initialize response array

if ($result && $result->num_rows > 0) {
    // Fetch rows from the result set
    while ($row = $result->fetch_assoc()) {
        // Add each row to the response array
        $response[] = $row;
    }
}

// Close connection
$conn->close();

// Send response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
