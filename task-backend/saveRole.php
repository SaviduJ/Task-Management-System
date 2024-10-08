<?php 
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = mysqli_connect("localhost", "root", "", "asana");

    


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Receive data from React frontend

$data = json_decode(file_get_contents('php://input'), true);
$roleName = $data['roleName'] ?? null;

if ($roleName === null) {
    die("Project name is required");
}

// Prepare SQL statement
$sql = "INSERT INTO user_roles (userRole) VALUES (?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $roleName);

$response = [];

// Execute SQL statement
if ($stmt->execute()) {
    $response = [
        "success" => true,
        "message" => "role saved successfully",
        "role" => [
            "id" => $conn->insert_id,
            "userRole" => $roleName
        ]
    ];
} else {
    echo "Error: " . $conn->error;
}

// Close connection
$stmt->close();
$conn->close();

echo json_encode($response);

?>