<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$conn = mysqli_connect("localhost", "root", "", "asana");

if(!$conn){
    die(json_encode(["error" => "Connection error"]));
}

$response = ["users" => [], "projects" => [], "user_projects" => []];

// Fetch users
$sql_users = "SELECT id, user FROM user1";
$result_users = $conn->query($sql_users);

if ($result_users->num_rows > 0) {
    while($row = $result_users->fetch_assoc()) {
        $response["users"][] = $row;
    }
}

// Fetch projects
$sql_projects = "SELECT id, projectname FROM projects";
$result_projects = $conn->query($sql_projects);

if ($result_projects->num_rows > 0) {
    while ($row = $result_projects->fetch_assoc()) {
        $response["projects"][] = $row;
    }
}

// Fetch user-project assignments
$sql_user_projects = "
    SELECT projects.projectname, users.user 
    FROM userprojects 
    JOIN user1 AS users ON userprojects.user_id = users.id 
    JOIN projects ON userprojects.project_id = projects.id
";

$result_user_projects = $conn->query($sql_user_projects);

if ($result_user_projects->num_rows > 0) {
    while ($row = $result_user_projects->fetch_assoc()) {
        $response["user_projects"][] = $row;
    }
}

echo json_encode($response);
$conn->close();
?>
