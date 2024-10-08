<?php
    $conn = mysqli_connect("localhost", "root", "", "asana");

    if(!$conn){
        die("connection error");
    }

    $sql_users = "SELECT id, user FROM user1";
    $result_users = $conn->query($sql_users);

    $sql_projects = "SELECT id, project_name FROM project";
    $result_projects = $conn->query($sql_projects);

    $users = [];
    $projects = [];

    if ($result_users->num_rows > 0) {
        while($row = $result_users->fetch_assoc()) {
            $users[] = $row;
        }
    }

    if ($result_projects->num_rows > 0) {
        while ($row = $result_projects->fetch_assoc()) {
            $projects[] = $row;
        }
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $projectId = $_POST['project_id'];
        $userIds = $_POST['user_ids'];

        if (!empty($projectId) && !empty($userIds)) {
            // Remove existing user assignments for the project
            $sql_delete = "DELETE FROM userprojects WHERE project_id = ?";
            $stmt = $conn->prepare($sql_delete);
            $stmt->bind_param("i", $projectId);
            $stmt->execute();

            // Insert new user assignments
            $sql_insert = "INSERT INTO userprojects (user_id, project_id) VALUES (?, ?)";
            $stmt = $conn->prepare($sql_insert);

            foreach ($userIds as $userId) {
                $stmt->bind_param("ii", $userId, $projectId);
                $stmt->execute();
            }

            echo "Users assigned successfully!";
        } else {
            echo "Please select a project and at least one user.";
        }
    }

    $sql_user_projects = "
    SELECT projects.project_name, users.user 
    FROM userprojects 
    JOIN user1 AS users ON userprojects.user_id = users.id 
    JOIN project AS projects ON userprojects.project_id = projects.id
    ";

    $result_user_projects = $conn->query($sql_user_projects);

    $user_projects = [];

    if ($result_user_projects->num_rows > 0) {
        while ($row = $result_user_projects->fetch_assoc()) {
            $user_projects[] = $row;
        }
    }

    $conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
        function displayUsers() {
            var userList = document.getElementById("userList");
            userList.innerHTML = "";

            var users = <?php echo json_encode($users); ?>;
            users.forEach(function(user) {
                var listItem = document.createElement("li");

                // Create checkbox
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "user_ids[]";
                checkbox.value = user.id;

                listItem.appendChild(checkbox);
                listItem.appendChild(document.createTextNode(user.user));
                userList.appendChild(listItem);
            });
        }

        // Function to initialize the users list when the page loads
        window.onload = function() {
            displayUsers();
        }
    </script>
</head>
<body>
    <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
        <label for="projectDropdown">Select Project:</label>
        <select id="projectDropdown" name="project_id">
            <option value="">Select a project</option>
            <?php foreach ($projects as $project): ?>
                <option value="<?php echo $project['id']; ?>"><?php echo $project['project_name']; ?></option>
            <?php endforeach; ?>
        </select>

        <h2>Users</h2>
        <ul id="userList">
            <!-- Users will be populated here by JavaScript -->
        </ul>

        <button type="submit">Assign Users</button>
    </form>

    <table>
        <tr>
            <th>Project</th>
            <th>User</th>
        </tr>
        <?php foreach ($user_projects as $assignment): ?>
            <tr>
                <td><?php echo $assignment['project_name']; ?></td>
                <td><?php echo $assignment['user']; ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>
