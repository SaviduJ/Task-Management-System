<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$conn = mysqli_connect("localhost", "root", "", "asana");

if(!$conn){
    die(json_encode(["error" => "Connection error"]));
}

$data = json_decode(file_get_contents('php://input'), true);
$projectId = $data['project_id'];
$userIds = $data['user_ids'];

if (!empty($projectId) && !empty($userIds)) {
    // Remove existing user assignments for the project
    $sql_delete = "DELETE FROM userprojects WHERE project_id = ?";
    $stmt = $conn->prepare($sql_delete);
    $stmt->bind_param("i", $projectId);
    $stmt->execute();

    // Insert new user assignments
    $sql_insert = "INSERT INTO userprojects (user_id, project_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql_insert);

    foreach ($userIds as $userId) {
        $stmt->bind_param("ii", $userId, $projectId);
        $stmt->execute();
    }

    echo json_encode(["success" => "Users assigned successfully!"]);
} else {
    echo json_encode(["error" => "Please select a project and at least one user."]);
}

$conn->close();
?>
