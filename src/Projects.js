
 import Sidebaruser from './Sidebaruser'
 import Header from './Header'
 import React, { useState,useEffect} from 'react';
import Sidebar from './Sidebar';
 
export default function Projects() {

    /*
      

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                  Projects
                </th>
                <th scope="col" class="px-6 py-3">
                   Assignees
                </th>
                <th scope="col" class="px-6 py-3">
                    
                </th>
            </tr>
        </thead>
        <tbody>
           {userProjects.map((assignment, index) => (
            <tr key={index} class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {assignment.projectname}
                </th>
                <td class="px-6 py-4">
                   {assignment.user}
                </td>    
            </tr>
           ))}
        </tbody>
    </table>
</div>

  
  */

    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [userProjects, setUserProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [editField, setEditField] = useState({ index: -1, field: '' });

    useEffect(() => {
        
        fetch('http://localhost:8000/get_data.php')
            .then(response => response.json())
            .then(data => {
                setUsers(data.users);
                setProjects(data.projects);
                setUserProjects(data.user_projects);
            });
    }, []);


    const handleSubmits = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/saveProject.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projectName }),
            });
            console.log(JSON.stringify({ projectName }))
            const data = await response.json();
            if (data.success) {
                setProjects(prevProjects => [...prevProjects, data.project]);
                setProjectName(''); // Reset the input field
                console.log(data.project)
            } else {
                console.error(data.error);
            }
          
             // Handle response from backend
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
    };

    const handleUserChange = (e) => {
        const userId = parseInt(e.target.value, 10);
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter((id) => id !== userId)
                : [...prevSelectedUsers, userId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedProject && selectedUsers.length > 0) {
            fetch('http://localhost:8000/assign_users.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    project_id: selectedProject,
                    user_ids: selectedUsers,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.success || data.error);
                    setSelectedProject('');
                    setSelectedUsers([]);
                    if (data.success) {
                        // Reload the page after alert is acknowledged
                        window.location.reload();
                    }

                });
        } else {
            alert("Please select a project and at least one user.");
        }
    };
    const groupAssignmentsByProject = (assignments) => {
        return assignments.reduce((acc, assignment) => {
            const existingProject = acc.find(item => item.projectname === assignment.projectname);
            if (existingProject) {
                existingProject.users.push(assignment.user);
            } else {
                acc.push({
                    projectname: assignment.projectname,
                    users: [assignment.user]
                });
            }
            return acc;
        }, []);
    }

    const transformedAssignments = groupAssignmentsByProject(userProjects);

    const handleEditProjectName = (index) => {
        setEditField({ index, field: 'projectname' });
    };

    const handleInputChange = (e, index, field) => {
        const updatedProjects = [...projects];
        updatedProjects[index][field] = e.target.value;
        setProjects(updatedProjects);
    };

    const handleKeyPress = async (e, index) => {
        if (e.key === 'Enter') {
            await saveProjectName(index);
            e.target.blur();
            setEditField({ index: -1, field: '' });
        }
    };

    const saveProjectName = async (index) => {
        // Ensure projects[index] is defined
        if (projects[index]) {
            const project = projects[index];
            try {
                const response = await fetch('http://localhost:8000/updateProject.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: project.id,
                        projectname: project.projectname,
                    }),
                });
                const data = await response.json();
                if (!data.success) {
                    console.error(data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            console.error(`Project at index ${index} is undefined or does not exist.`);
        }
    };

    return (
        <div >
              <Header />
              <Sidebar />
            <div className="ml-64 pl-5 mt-10 mb-2" >
                   



            <form onSubmit={handleSubmits}>
            <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
            />
            <button type="submit">Save Project</button>
        </form>
        <h2 class=" mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-white">Project List</h2>
            <ul class="max-w-md space-y-1 text-gray-800 list-disc list-inside dark:text-gray-800">
            {projects.map((project, index) => (
                        <li key={project.id}>
                            {editField.index === index && editField.field === 'projectname' ? (
                                <input
                                    value={project.projectname}
                                    onChange={(e) => handleInputChange(e, index, 'projectname')}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    autoFocus
                                />
                            ) : (
                                <span onClick={() => handleEditProjectName(index)}>
                                    {project.projectname}
                                </span>
                            )}
                        </li>
                    ))}
            </ul>
            <form class="mt-5 relative overflow-x-auto shadow-md sm:rounded-lg " onSubmit={handleSubmit}>
                   <h1 class ="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Assign users to the projects</h1>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="projectDropdown">Select Project:</label>
                <select
                    class="block w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="projectDropdown"
                    value={selectedProject}
                    onChange={handleProjectChange}
                >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.projectname}
                        </option>
                    ))}
                </select>
       
                <h2>Users</h2>
               
                <ul id="userList">
                    {users.map((user) => (
                      
                        <li key={user.id}>
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                name="user_ids[]"
                                value={user.id}
                                checked={selectedUsers.includes(user.id)}
                                onChange={handleUserChange}
                            />
                            {user.user}
                        </li>
                       
                    ))}
                </ul>
               

                <button 
                  type="submit"
                  class=" mt-2 text-white bg-gray-900 hover:bg-gray-700 focus:ring-1 focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                > 
                    Assign Users
                </button>
            </form>

            <div class=" mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="mt-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                  Projects
                </th>
                <th scope="col" class="px-6 py-3">
                   Assignees
                </th>
                <th scope="col" class="px-6 py-3">
                    
                </th>
            </tr>
        </thead>
        <tbody>
           {transformedAssignments.map((assignment, index) => (
            <tr key={index} class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {assignment.projectname}
                </th>
                <td class="px-6 py-4">
                   {assignment.users.join(', ')}
                </td>    
            </tr>
           ))}
        </tbody>
    </table>
</div>
          </div>
        </div>
    );


}
