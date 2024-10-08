<?php 
   header("Access-Control-Allow-Origin: http://localhost:3000");
   header("Access-Control-Allow-Methods: GET,POST");
   header("Access-Control-Allow-Headers: Content-Type");
   
   $servername = "127.0.0.1"; // Update with your MySQL server address
   $port = "3308"; // Update with your MySQL port if different
   $username = "root"; // Update with your MySQL username
   $password = ""; // Update with your MySQL password
   $database = "asana"; // Update with your MySQL database name
   
   // Create connection
   $conn = new mysqli($servername , $username, $password, $database);
   
   // Check connection
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }else{
       $eData = file_get_contents("php://input");
       $dData= json_decode($eData,true);

       $user = $dData['user'];
       $email=$dData['email'];
       $pass=$dData['pass'];
       $role = isset($dData['role']) ? $dData['role'] : 'dev';

       $result ="";

       if ($user != "" && $email != "" && $pass != "") {
        $status = 1;
        // Prepare and bind
        $stmt = $conn->prepare("INSERT INTO user1 (user, email, pass, status,role) VALUES (?, ?, ?, ?,?)");
        $stmt->bind_param("sssis", $user, $email, $pass,$status,$role);

        if ($stmt->execute()) {
            $result = "You have registered successfully";
        } else {
            $result = "";
        }
        
        $stmt->close();
    } else {
        $result = "";
    }
        
          $conn ->close();
          $response[]=array("result"=> $result);
          echo json_encode($response);  

   }

?>