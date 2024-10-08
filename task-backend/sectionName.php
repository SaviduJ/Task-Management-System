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

// Get the POST data
$postData = json_decode(file_get_contents("php://input"), true);

// Extract values
$userId = isset($postData['userId']) ? $postData['userId'] : null;
$section = isset($postData['section']) ? $postData['section'] : null;

$response = array(); // Initialize response array

if ($userId !== null && $section !== null) {
    // Perform database insert
    $sql = "INSERT INTO sections (user_id, section_name) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $userId, $section);

    if ($stmt->execute()) {
        $response["success"] = true;
        $response["message"] = "Section added successfully";
    } else {
        $response["success"] = false;
        $response["message"] = "Error adding section: " . $stmt->error;
    }

    $stmt->close();
} else {
    $response["success"] = false;
    $response["message"] = "Incomplete data provided";
}

$conn->close();

// Send response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
