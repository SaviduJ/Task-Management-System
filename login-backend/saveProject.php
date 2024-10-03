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
$projectName = $data['projectName'] ?? null;

if ($projectName === null) {
    die("Project name is required");
}

// Prepare SQL statement
$sql = "INSERT INTO projects (projectname) VALUES (?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $projectName);

$response = [];

// Execute SQL statement
if ($stmt->execute()) {
    $response = [
        "success" => true,
        "message" => "Project saved successfully",
        "project" => [
            "id" => $conn->insert_id,
            "projectname" => $projectName
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