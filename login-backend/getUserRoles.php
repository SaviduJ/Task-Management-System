<?php  
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$conn = mysqli_connect("localhost", "root", "", "asana");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, userRole FROM user_roles";
$result = $conn->query($sql);

$userRoles = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $userRoles[] = $row;
    }
}

echo json_encode($userRoles);

$conn->close();
?>
