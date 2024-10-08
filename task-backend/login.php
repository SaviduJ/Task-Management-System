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
  

  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}else{
    $eData = file_get_contents("php://input");
    $dData= json_decode($eData,true);

    $user =$dData['user'];
    $pass=$dData['pass'];
   
    $result ="";

    if($user!= "" and $pass !=""){
        $sql = "SELECT*FROM user1 WHERE user='$user' ;";
        $res = mysqli_query($conn,$sql);

        if(mysqli_num_rows($res) !=0){
            $row = mysqli_fetch_array($res);
            if($pass !=$row['pass']){
                $result ="Invalid password";
            }else{
                $result="Logged succesfully! Redirecting...";
                $userRole = $row['role'];
                $user_roleId = $row['user_roleId'];
                $id = $row['id'];

                $sql_user_permissions= "SELECT pm.name
                FROM permissions p
                JOIN permission_module pm ON p.permission_moduleId = pm.id
                WHERE p.roleId =  $user_roleId ";


                $permissions_res = mysqli_query($conn, $sql_user_permissions);
                $permissions = [];

                while ($perm_row = mysqli_fetch_assoc($permissions_res)) {
                $permissions[] = $perm_row['name'];
                   }
               

                 // Assuming the role column is named 'role'
                $response = array(
                    "result" => $result,
                    "userRole" => $userRole,
                    "user_roleId"=>$user_roleId,
                    "id"=>$id,
                    "permissions" => $permissions,

                );
            }
            
        }else{
            $result="Invalid username";
        }
    }else{
        $result="";
    }

    $conn->close();
    $response[]= array("result"=>$result);
    echo json_encode($response);

}


?>