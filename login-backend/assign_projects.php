<?php
    $conn = mysqli_connect("localhost", "root", "", "asana");


    if(!$conn){
        die("connection error");
    }


    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $userId = $_POST['user_id'];
        $projectIds = $_POST['project_ids'];
    
        if (!empty($userId) && !empty($projectIds)) {
            // Remove existing project assignments for the user
            $sql_delete = "DELETE FROM userprojects WHERE user_id = ?";
            $stmt = $conn->prepare($sql_delete);
            $stmt->bind_param("i", $userId);
            $stmt->execute();
    
            // Insert new project assignments
            $sql_insert = "INSERT INTO userprojects (user_id, project_id) VALUES (?, ?)";
            $stmt = $conn->prepare($sql_insert);
    
            foreach ($projectIds as $projectId) {
                $stmt->bind_param("ii", $userId, $projectId);
                $stmt->execute();
            }
    
            echo "Projects assigned successfully!";
        } else {
            echo "Please select a user and at least one project.";
        }
    }


    
    
    $conn->close();



?>