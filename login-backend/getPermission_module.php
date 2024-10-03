<?php 


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$conn = mysqli_connect("localhost", "root", "", "asana");


if(!$conn){
    die(json_encode(["error" => "Connection error"]));
}

$sql_permissions = "SELECT id, name FROM permission_module";
$result_permissions = $conn->query($sql_permissions);

if ($result_permissions->num_rows > 0) {
    while($row = $result_permissions->fetch_assoc()) {
        $response["permissions"][] = $row;
    }
} 

$sql_role_permissions = "
    SELECT user_roles.userRole,permission_module.name 
    FROM permissions
    JOIN permission_module ON permissions.permission_moduleId = permission_module.id 
    JOIN user_roles ON permissions.roleId = user_roles.id
";

$sql_role_permissions = $conn->query($sql_role_permissions);

if ($sql_role_permissions->num_rows > 0) {
    while ($row = $sql_role_permissions->fetch_assoc()) {
        $response["role_permissions"][] = $row;
    }
}


echo json_encode($response);
$conn->close();

?>