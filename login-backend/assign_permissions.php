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

$roleId = $data['role_id'];
$permissionIds = $data['permissions_ids'];

if (!empty($roleId) && !empty($permissionIds)) {
    // Remove existing user assignments for the project
    $sql_delete = "DELETE FROM permissions WHERE roleId = ?";
    $stmt = $conn->prepare($sql_delete);
    $stmt->bind_param("i", $roleId);
    $stmt->execute();

    // Insert new user assignments
    $sql_insert = "INSERT INTO permissions (permission_moduleId, roleId) VALUES (?, ?)";
    $stmt = $conn->prepare($sql_insert);

    foreach ($permissionIds as $permissionId) {
        $stmt->bind_param("ii", $permissionId, $roleId);
        $stmt->execute();
    }

    echo json_encode(["success" => "permissions assigned successfully!"]);
} else {
    echo json_encode(["error" => "Please select a role and at least one permission."]);
}




?>