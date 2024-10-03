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
      

       if($user !="" ){
          $sql ="SELECT*FROM user1 WHERE user =$user";
          $res=mysqli_query($conn,$sql);
          if(mysqli_num_rows($res)!=0){
            $result = "Username is already taken";
          }
          else{
            $result ="";
          }
        }else{
            $result="";
        }

          $conn ->close();
          $response[]=array("result"=> $result);
          echo json_encode($response);
      

   }

?>