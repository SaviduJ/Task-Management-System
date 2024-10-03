import React, { useState, useEffect, } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
//import'./Dashboard.css'
import Sidebaruser from './Sidebaruser';
import { useNavigate } from 'react-router-dom';

export default function Users() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isAddFormVisible, setAddFormVisible] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [hoveredUserIndex, setHoveredUserIndex] = useState(-1);
    const [editField, setEditField] = useState({ index: -1, field: '' });
    const [userRole, setUserRole] = useState("");
    const naviget = useNavigate();
    const [userRoles, setUserRoles] = useState([]);
    const [roleName, setRoleName] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const[selectedRole, setSelectedRole] = useState('');
    const [permissions,setpermissions] = useState([]);
    const [selectedPermission, setSelectedPermission] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [Permissions, SetPermissions] = useState([]);

    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };

    
    useEffect(() => {
        
        fetch('http://localhost:8000/getpermission_module.php')
            .then(response => response.json())
            .then(data => {
                setpermissions(data.permissions);
                setRolePermissions(data.role_permissions);
            });
    }, []);

    useEffect(() => {  
        let login = localStorage.getItem("login");
        if (!login) {
           naviget("/", { replace: true });
        } else {
          
           const userRole = localStorage.getItem("user_roleId");
           const storedPermissions = localStorage.getItem("permissions");
           
           setUserRole(userRole);
           SetPermissions(storedPermissions);
        }

        console.log(Permissions,userRole ); 
     }, [naviget]);

     useEffect(() => {
        fetch('http://localhost:8000/getUser.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
           
            .then((data) => {
                console.log('Users:', data);
                setUsers(data);
            })
            .catch((error) => console.error('Error:', error));

        fetch('http://localhost:8000/getUserRoles.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => setUserRoles(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    

    const grouppermissionsByRole = (permissions) => {
        return permissions.reduce((acc, permission) => {
            const existingRole = acc.find(item => item.userRole === permission.userRole);
            if (existingRole) {
                existingRole.name.push(permission.name);
            } else {
                acc.push({
                    userRole: permission.userRole,
                    name: [permission.name]
                });
            }
            return acc;
        }, []);
    }
    const transformedPermissions = grouppermissionsByRole(rolePermissions);

    const handleSubmits = async (e) => {

        const confirmSave = window.confirm("Do you want to save the new role?");
        if (confirmSave) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/saveRole.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roleName }),
            });
            console.log(JSON.stringify({ roleName }))
            const data = await response.json();   
            if (data.success) {
                setUserRoles(prevRoles => [...prevRoles, data.role]);
                setRoleName(''); // Reset the input field
                console.log(data.project)
            } else {
                console.error(data.error);
            }
          
             // Handle response from backend
        } catch (error) {
            console.error('Error:', error);
        }
     } 
       else {
        console.error('User canceled the save operation.');
       }
    };


    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const toggleAddFormVisibility = () => {
        setAddFormVisible(!isAddFormVisible);
    };

    const handleInputChange = (e, index, field) => {
        const updatedUsers = [...users];
        updatedUsers[index][field] = e.target.value;
        setUsers(updatedUsers);
    };

    const handleSave = (index) => {
        const editedUser = users[index];
    
        console.log('Saving edited data:', editedUser);
    
        fetch(`http://localhost:8000/updateUser.php?id=${editedUser.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedUser),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
        setEditField(-1);
    };

    const handleKeyPress = (e, index) => {
        if (e.key === 'Enter') {
            handleSave(index);
            e.target.blur();
        }
    };

    const handleRoleChange = (e, index) => {
        const newRoleId = e.target.value;
        updateUser(index, { user_roleId: newRoleId });
        setEditField(-1);
    };
    
    const handleStatusChange = (e, index) => {
        const newStatus = e.target.value === "1" ? 1 : 0;
        updateUser(index, { status: newStatus });
        setEditField(-1);
    };

    const updateUser = (index, updatedFields) => {
        const editedUser = { ...users[index], ...updatedFields };
    
        console.log('Saving edited data:', editedUser);
    
        fetch(`http://localhost:8000/updateUser.php?id=${editedUser.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedUser),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const updatedUsers = [...users];
            updatedUsers[index] = { ...updatedUsers[index], ...updatedFields };
            setUsers(updatedUsers);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleDeleteUser = (event, userId) => {
        event.stopPropagation();
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            fetch(`http://localhost:8000/deleteUser.php?id=${userId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setUsers(users.filter(user => user.id !== userId));
                console.log('User deleted successfully');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };
    const handleFieldClick = (index, field) => {
        setEditField({ index, field });
    };
    const handlePermissionChange = (e) => {
        const permissionId = parseInt(e.target.value, 10);
        setSelectedPermission((prevSelectedPermissions) =>
            prevSelectedPermissions.includes(permissionId)
                ? prevSelectedPermissions.filter((id) => id !== permissionId)
                : [...prevSelectedPermissions, permissionId]
        );
    };
    
    const handleroleChange = (e) => {
        setSelectedRole(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedRole && selectedPermission.length > 0) {
            fetch('http://localhost:8000/assign_permissions.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role_id: selectedRole,
                    permissions_ids: selectedPermission,
                }),
            })

           
                .then(response => response.json())
                .then(data => {
                    alert(data.success || data.error);
                    setSelectedRole('');
                    setSelectedPermission([]);
                    if (data.success) {
                        // Reload the page after alert is acknowledged
                        window.location.reload();
                    }

                });
        } else {
            alert("Please select a role and at least one permission.");
        }
    };


    const hasUserAccess = Permissions.includes("user access");
   



    return (
 /*  
                  
   </tr>*/
        <div>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar  isSidebarOpen={isSidebarOpen} tasks={tasks} toggleAddFormVisibility={toggleAddFormVisibility}  />
           
            <div style={{ marginLeft: '250px', paddingLeft: '20px' }}>
                   



{hasUserAccess ? (  
<>
        
<div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-12"> 
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                   Username
                </th>
                <th scope="col" class="px-6 py-3">
                Email
                </th>
                <th scope="col" class="px-6 py-3">
                Status
                </th>
                <th scope="col" class="px-6 py-3">
                Role
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Delete</span>
                </th>
            </tr>
        </thead>
        <tbody>
         {users.map((user, index) => (
           <React.Fragment key={user.id}>
            
             <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
             
             
    <>
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={() => handleFieldClick(index, 'user')}>
            {editField.index === index && editField.field === 'user' ? (
                <input
                    className='user'
                    value={user.user}
                    onChange={(e) => handleInputChange(e, index, 'user')}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                />
            ) : (
                user.user
            )}
        </th>
        <td class="px-6 py-4" onClick={() => handleFieldClick(index, 'email')}>
            {editField.index === index && editField.field === 'email' ? (
                <input
                    className='email'
                    value={user.email}
                    onChange={(e) => handleInputChange(e, index, 'email')}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                />
            ) : (
                user.email
            )}
        </td>
        <td class="px-6 py-4" onClick={() => handleFieldClick(index, 'status')}>
            {editField.index === index && editField.field === 'status' ? (
                <select value={user.status} onChange={(e) => handleStatusChange(e, index)}>
                    <option value="0">Inactive</option>
                    <option value="1">Active</option>
                </select>
            ) : (
                
                user.status == 1? "Active" : "Inactive"
                
               
            )}
           
        </td>
        <td class="px-6 py-4" onClick={() => handleFieldClick(index, 'role')}>
            {editField.index === index && editField.field === 'role' ? (
                <select value={user.user_roleId} onChange={(e) => handleRoleChange(e, index)}>
                {userRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.userRole}</option>
                ))}
            </select>
            ) : (
                <>
                {userRoles.find(role => role.id === user.user_roleId)?.userRole || 'N/A'}
               
              </>
            )}
        </td>
        <td class="px-6 py-4 text-right">
            <a href="#" onClick={(event) => handleDeleteUser(event, user.id)} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
        </td>
    </>            
            </tr>
            </React.Fragment>
                        ))}  
        </tbody>
    </table>

    
        </div>
        <div>
      <button
        onClick={toggleModal}
        className=" mt-4 block text-white bg-gray-800 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
       Create a role
      </button>

      {isModalOpen && (
        <div
          id="static-modal"
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-x-hidden overflow-y-auto bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  User Roles
                </h3>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
              <form class='mt-6'onSubmit={handleSubmits}>
            <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="add a new role"
                required
            />
            <button   type="submit">Add a Role</button>
        </form>
        <h2>Roles</h2>
              {userRoles.map(role => (
                    <li key={role.id} value={role.id}>{role.userRole}</li>
                ))}
                
              </div>
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
               
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <form class="mt-5 relative overflow-x-auto shadow-md sm:rounded-lg " onSubmit={handleSubmit}>
          <h1 class ="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Assign permissions to the role</h1>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="projectDropdown">Select role:</label>
                <select
                    class="block w-1/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="projectDropdown"
                    value={selectedRole}
                    onChange={handleroleChange}
                   
                >
                    <option value="">Select a role</option>
                    {userRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.userRole}
                        </option>
                    ))}
                </select>

                <h2>Permissions</h2>

                <ul id="permissionList">
                    {permissions.map((permission) => (
                      
                        <li key={permission.id}>
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                name="permission_ids[]"
                                value={permission.id}
                                checked={selectedPermission.includes(permission.id)}
                                onChange={handlePermissionChange}
                            />
                            {permission.name}
                        </li>
                       
                    ))}
                </ul>
                <button 
                  type="submit"
                  class=" mt-2 text-white bg-gray-900 hover:bg-gray-700 focus:ring-1 focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                > 
                    Assign Permissions
                </button>
            </form>

    <div class=" mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="mt-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                  Role
                </th>
                <th scope="col" class="px-6 py-3">
                   Permissions
                </th>
                <th scope="col" class="px-6 py-3">
                    
                </th>
            </tr>
        </thead>
        <tbody>
           {transformedPermissions.map((rolePermission, index) => (
            <tr key={index} class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {rolePermission.userRole}
                </th>
                <td class="px-6 py-4">
                   {rolePermission.name.join(', ')}
                </td>    
            </tr>
           ))}
        </tbody>
      </table>
   </div>


    </>
      ) : (
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-12">
        <p>You have no permissions to access the users.</p>
        </div>
    )}










            </div>
        </div>
    );
}
