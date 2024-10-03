<?php 
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");


$conn = mysqli_connect("localhost", "root", "", "asana");
   
    


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, projectname FROM projects";
$result = $conn->query($sql);

// Check if any projects were found
if ($result->num_rows > 0) {
    // Output data of each row
    $projects = [];
    while ($row = $result->fetch_assoc()) {
        $projects[] = $row;
    }
    // Convert projects array to JSON and output
    echo json_encode($projects);
} else {
    echo "0 results";
}

// Close connection
$conn->close();

?>