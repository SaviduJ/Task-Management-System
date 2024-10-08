<?php  
    //$conn = mysqli_connect("localhost", "root", "", "asana");
    //$query="SELECT *FROM project  ";  //Getting project data
    //$query="SELECT project_name,duedate FROM project";//select inetended columns from projects  
    //$query="SELECT* FROM project WHERE estimatedTime ='6 hours' AND status = b'1' ";//get projects where status =1 and estimate time = 6hours
    //$query="SELECT*FROM project ORDER BY project_name";//here project table will oerder by project name alphabatically
    //$query="INSERT INTO project(project_name,estimatedTime,duedate,status)VALUES('Project asana2','5 hours','feb 14',b'0')";//Add new project and add intended values to columns
    //$query="SELECT*FROM project WHERE assignee  IS NOT NULL";//remove all projects with null values for intended columns and display the other data
    //$query="UPDATE project SET assignee='John Doe' WHERE id = 13";//Change assingee name of project which has id = 13 to John Doe
    //$query="DELETE FROM project WHERE estimatedTime= '1 hours'";// delete all rows that estaimated time equals 1 hour
    //$query="SELECT * FROM project LIMIT 3";//display only first 3 rows of projects
    //$query="SELECT MIN(credit) AS min_credit FROM project";// display minimum credit value exist
    //$query="SELECT MAX(credit) AS max_credit FROM project";// display maximum credit value exist
    //$query="SELECT AVG(credit) AS avg_credit FROM project";// display average credit value exist
    //$query="SELECT SUM(credit) AS sum_credit FROM project";// display sum of credit values exist
    //$query="SELECT COUNT(credit) AS count_credit FROM project";// display count of credit values exist
    //$query="SELECT * FROM project WHERE assignee LIKE '%smith'";//statement selects all projects with a assignee starting with "a"
    //$query="SELECT * FROM project WHERE assignee LIKE '%a%'";//statement selects all projects with a assignee containing the pattern "-a-"
    //$query="SELECT * FROM project WHERE estimatedTime IN ('5 hours', '4 hours', '3 hours')";//statement selects all projects that have estimated time "5 hours", "4 hours" or "3 hours"
    //$query="SELECT * FROM Project WHERE credit BETWEEN 3 AND 7 ORDER BY credit";//display all projects which has credit between 3 and 7 and order by credit
    //$query="SELECT * FROM Project WHERE assignee BETWEEN 'Frank Green' AND 'Nick Adams' ORDER BY assignee";//display all projects which has names between Frank Green and Nick Adams and order by assignee
    //$query="SELECT assignee AS Names FROM project ";//sekect assignee column from project and change the name of column as Names
    //$query="SELECT project.assignee,task.country,project.referenceid FROM project INNER JOIN task ON project.referenceid = task.referenceid";//statement selects all projects with task information
    //$query="SELECT project.assignee,task.country,project.referenceid FROM project LEFT JOIN task ON project.referenceid = task.referenceid";//statement will select all projects, and any task it might have
    //$query="SELECT project.assignee,task.country,task.referenceid FROM project RIGhT JOIN task ON project.referenceid = task.referenceid";//statement will select all tasks, and any project it might have
    //$query="SELECT project.assignee,task.country,project.referenceid FROM project CROSS JOIN task ON project.referenceid = task.referenceid";//statement selects all projects with task information
    //$query="SELECT A.assignee AS Assignee1,B.assignee AS Assignee2,A.estimatedTime FROM project A,project B WHERE A.estimatedTime = B.estimatedTime";
    //$query="SELECT assignee FROM project UNION SELECT task FROM task ORDER BY assignee";//statement return both tasks and assignees from project and task table under assignee colunm 
    //$query="SELECT COUNT(project_name),estimatedTime FROM project GROUP BY estimatedTime";//statement lists the number of projects for each estimated time
    //$query="SELECT COUNT(project_name),estimatedTime FROM project GROUP BY estimatedTime HAVING COUNT(project_name) < 4 ";//statement lists the number of projects for each estimated time which are having less than 4 projects
    //$query="SELECT country FROM task WHERE EXISTS (SELECT project_name FROM project WHERE project.referenceid = task.referenceid )";//statement display a of lists countries with a  which ahs a project  for its reference id
    //$query="SELECT task FROM task WHERE referenceid = ANY(SELECT referenceid FROM project WHERE credit = 5)";// statement lists the task if it finds ANY records in the project table thta has credit eqals to 5
    /*$query="SELECT id, credit, 
              CASE 
               WHEN credit > 5 THEN 'credit is greater than 5' 
               WHEN credit = 5 THEN 'credit is equal to 5' 
               ELSE 'credit is less than 5' 
            END AS CreditText FROM project";*/ //here goes through conditions and returns a value when the right condition is met
    // $query="SELECT project_name,estimatedTime,IFNULL(assignee,  'No Assignee') AS assignee FROM project";//if there is no assignee for a project then display 'no assignee 'in that column'      
    //$query="CREATE TABLE orders(orderId int NOT NULL,OrderNumber int NOT NULL,projectid int ,PRIMARY KEY (orderId),FOREIGN KEY (projectid) REFERENCES project(id))" ;//creating new table with existing tables id as foreign key   

   // $query="INSERT INTO user1(user,email,pass)VALUES('savidu2','sddd@jj.com','wwwwwwwww')";


   

   

    $result = mysqli_query( $conn, $query );

    if(!$conn){
        die("connection error");
    }


?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
     <table>
           <tr>
              <td>id</td>
              <td>project_name</td>
              <td>estimatedTime</td>
              <td>duedate</td>
              <td>status</td>
              <td>assignee</td>
              <td>credit</td>
           </tr>
           <tr>
           <?php
           // while($row =mysqli_fetch_assoc($result))
              {
                
               
                ?>


                 <!--<td><?php// echo $row["id"]; ?> </td>
                 <td><?php// echo $row["project_name"]; ?> </td>
                 <td><?php// echo $row["estimatedTime"]; ?> </td>
                 <td><?php// echo $row["duedate"]; ?> </td>
                 <td><?php// echo $row["status"]; ?> </td>
                 <td><?php// echo $row["assignee"]; ?> </td>
                 <td><?php// echo $row["referenceid"]; ?></td>
                 <td><?php// echo $row["country"]; ?></td>
                 <td><?php// echo $row["task"]; ?></td>
                 <td><?php// echo $row["Names"]; ?></td>
                 <td><?php// echo $row["credit"]; ?> </td>
                 <td><?php// echo $row["count_credit"]; ?> </td>
                 <td><?php// echo $row["Assignee1"]; ?></td>
                 <td><?php// echo $row["Assignee2"]; ?></td>
                 <td><?php// echo $row["estimatedTime"]; ?></td>
                 <td><?php// echo $row["assignee"]; ?></td>
                 <td><?php// echo $row["COUNT(project_name)"]; ?></td>
                 <td><?php// echo $row["estimatedTime"]; ?></td>
                 <td><?php// echo $row["CreditText"]; ?></td>-->
              </tr>
            <?php 
              
              }
           
           ?>

     </table>
</body>
</html>