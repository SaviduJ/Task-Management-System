<?php  

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$conn = mysqli_connect("localhost", "root", "", "asana");

if(!$conn){
    die(json_encode(["error" => "Connection error"]));
}


$response = ["comments" => []];

// Fetch users
$sql_comments = "SELECT id, task_id,comment,created_at FROM comments";
$result_comments = $conn->query($sql_comments);

if ($result_comments->num_rows > 0) {
    while($row = $result_comments->fetch_assoc()) {
        $response["comments"][] = $row;
    }
}

echo json_encode($response);
$conn->close();

?>