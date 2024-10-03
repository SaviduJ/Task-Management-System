<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
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

// Receive JSON data from the request body
$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

$user = $dData['user'];
$email = $dData['email'];

// Prepare and bind
$stmt = $conn->prepare("UPDATE user1 SET user=?, email=? WHERE id=?");
$stmt->bind_param("ssi", $user, $email, $dData['id']);

$result = [];

if ($stmt->execute()) {
    $result['result'] = "success";
} else {
    $result['result'] = "failed";
}

$stmt->close();
$conn->close();

// Send response
header('Content-Type: application/json');
echo json_encode($result);
?>
