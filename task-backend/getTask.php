<?php 
 header("Access-Control-Allow-Origin: http://localhost:3000");
 header("Content-Type: application/json");
 
 // Database connection parameters
 $servername = "127.0.0.1"; // Update with your MySQL server address
 $port = "3308"; // Update with your MySQL port if different
 $username = "root"; // Update with your MySQL username
 $password = ""; // Update with your MySQL password
 $database = "asana"; // Update with your MySQL database name
 
 // Create connection
 $conn = new mysqli($servername , $username, $password, $database);
 
 // Check connection
 if ($conn->connect_error) {
     die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
 }
 
 // Prepare SQL statement to select tasks
 $sql = "SELECT * FROM asana";
 
 // Execute SQL statement
 $result = $conn->query($sql);
 
 if ($result) {
     $tasks = array(); // Array to store tasks data
 
     // Fetch associative array of tasks
     while ($row = $result->fetch_assoc()) {
         $tasks[] = $row;
     }
 
     // Return tasks data as JSON response
     echo json_encode($tasks);
 } else {
     echo json_encode(array("error" => "Error: " . $conn->error));
 }
 
 // Close connection
 $conn->close();
 
 
 
 
 
?>