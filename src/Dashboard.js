import React, { useState,useEffect } from 'react';

//import'./Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowRight,faCalendar,faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {nanoid} from 'nanoid';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Header from './Header';
import Sidebar from './Sidebar';




export default function Dashboard() {
  

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const[addFormData,setAddFormData]= useState({

    taskName : '',
    dueDate : '',
    assignee :'',
    estimatedTime : '',
    comment: [],
    section_name:'',
   
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isAddFormVisible1, setAddFormVisible1] = useState(false);
  const [hoveredTaskIndex, setHoveredTaskIndex] = useState(-1);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempComment, setTempComment] = useState('');
  const [isDoTodayOpen, setDoTodayOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const[sectionName,setSectionName]=useState([]);
  const [userID, setUserId] = useState("");
  
  const naviget = useNavigate();
   const [username, setUsername] = useState("");

   const userId = userID;

   useEffect(() => {
    let login = localStorage.getItem("login");
    if (!login) {
       naviget("/", { replace: true });
    } else {
       let username = localStorage.getItem("username");
       let  user_roleId = localStorage.getItem("user_roleId");
       const userRole = localStorage.getItem("userRole");
       const userId1 = localStorage.getItem("id");
      // const user_roleId = localStorage.getItem("user_roleId");
       setUserId(userId1);
       setUsername(username);
       setUserRole(user_roleId);
    }
    console.log(userRole  )
 }, [naviget]);

  
    const user = username;

  useEffect(() => {
    fetchTasks();
  }, []);
  const [sections, setSections] = useState([]);

    useEffect(() => {
        // Fetch sections data from backend when component mounts
        fetch('http://localhost:8000/getSection.php')
            .then(response => response.json())
            .then(data => {
              setSectionName(data);
            })
            .catch(error => {
                console.error('Error fetching sections:', error);
            });
    }, []);

  useEffect(() => {
    fetch('http://localhost:8000/getUser.php')
        .then(response => response.json())
        .then(data => setAvailableUsers(data))
        .catch(error => console.error('Error fetching users:', error));
}, []);

useEffect(() => {
  fetch('http://localhost:8000/getComment.php')
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the response data
    })
    .catch(error => console.error('Error fetching users:', error));
}, []);

  


  const currentDate = new Date();
  const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = currentDate.getMonth();
  let hours = currentDate.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // handle midnight (0 hours)
  const minutes = currentDate.getMinutes();
  const formattedHours = hours < 10 ? `0${hours}` : hours;
const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
const timestamp = `${currentDate.getDate()}/${monthNamesShort[monthIndex]} ${formattedHours}:${formattedMinutes} ${ampm}`;
  
const fetchTasks=()=>{
      fetch("http://localhost:8000/getTask.php")
      .then(response=> response.json())
      .then(data =>{

        setTasks(data);
      })

      .catch(error=>console.error('Error fechting tasks:',error));

}




  const handleAddFormchange = (event)=>{
     event.preventDefault();

     const fieldName = event.target.getAttribute('name');
     const fieldValue= event.target.value;

     const newFormData = {...addFormData};
      newFormData[fieldName] = fieldValue;
     
      setAddFormData(newFormData);

  }

  const handleAddFormSubmitse = (event,userId) => {
    event.preventDefault();

    toggleAddFormVisibility1();

    const SectionName = {
        id: nanoid(),
        section: addFormData.section_name,
        
        userId
       
    };
    console.log(SectionName)

    const SectionNames = [...sectionName,  SectionName];
    setSectionName( SectionNames);
      
    fetch('http://localhost:8000/sectionName.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(SectionName)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log(data);
      // Update your state or do other necessary actions
  })
  .catch(error => {
      console.error('Error adding section:', error);
      // Handle error
  });
  
  
  
  }
   
    const handleTaskAddFormSubmit = (event, sectionIndex) => {
      event.preventDefault();
          
      const newTask = {
          ids: nanoid(),
          taskName: addFormData.taskName,
          dueDate: selectedDate ? selectedDate.toDateString() : '',
          assignee : addFormData.assignee,
          estimatedTime : addFormData.estimatedTime,
         
          // Add other task properties as needed
      };
  
      // Create a copy of the sections array
      const updatedSections = [...sectionName];
  
      // Check if tasks array is initialized for the specified section
      if (!updatedSections[sectionIndex].tasks) {
          // Initialize tasks array if it doesn't exist
          updatedSections[sectionIndex].tasks = [];
      }
  
      // Create a copy of the tasks array within the specified section
      const sectionTasks = [...updatedSections[sectionIndex].tasks, newTask];
  
      // Update the section with the updated tasks array
      updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          tasks: sectionTasks,
      };
  
      // Update the sectionName state with the updated sections array
      setSectionName(updatedSections);
      console.log('Sending data to backend:', newTask);
  
      // Reset task name input after adding the task
      setAddFormData({
          ...addFormData,
          taskName: '',
      });

  };
  
  
  
  



const handleAddFormSubmit = (event) => {
    event.preventDefault();

    toggleAddFormVisibility();

    const newTask = {
        id: nanoid(),
        taskName: addFormData.taskName,
        dueDate: selectedDate ? selectedDate.toDateString() : '',
        assignee: addFormData.assignee,
        estimatedTime: addFormData.estimatedTime,
        comments: addFormData.comment.map(comment => ({ text: comment.text, timestamp: comment.timestamp })),
        
       
    };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);

    console.log('Sending data to backend:', newTask);

    const requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
     body: JSON.stringify(newTask),
  };
  
  
  fetch('http://localhost:8000/saveTask.php', requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log(data); // Log response from the backend
          // Optionally, you can update the frontend state or show a success message to the user
      })
      .catch(error => {
          console.error('Error:', error);
          // Handle errors here (e.g., show an error message to the user)
      });
  

};



  function toggleSidebar() {

    setSidebarOpen(!isSidebarOpen);
  };

  const toggleRightSidebar = (event,task) => {
    event.stopPropagation(); 
    setSelectedTask(task);
    setRightSidebarOpen(!isRightSidebarOpen);
  };

  const toggleAddFormVisibility = () => {
    setAddFormVisible(!isAddFormVisible);
  };

  const toggleAddFormVisibility1 = () => {
    setAddFormVisible1(!isAddFormVisible1);
  };

  const handleTaskInputChange = (event, sectionIndex, taskIndex, field) => {
    const newSections = [...sectionName];
    const sectionTasks = newSections[sectionIndex].tasks.map((task, idx) =>
        idx === taskIndex ? { ...task, [field]: event.target.value } : task
    );
    newSections[sectionIndex] = { ...newSections[sectionIndex], tasks: sectionTasks };
    setSectionName(newSections);
};

  const handleInputChange = (event, index, field) => {
    const newTasks = [...tasks];
    newTasks[index][field] = event.target.value;
    setTasks(newTasks);
  };


  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      handleSave(index);
      e.target.blur(); 
    }
  };

  const handleKeyPressS = (e, sectionIndex, taskIndex) => {
    if (e.key === 'Enter') {
        handleSave(sectionIndex, taskIndex);
        e.target.blur();
    }
    setEditIndex(-1); 
}

  const handleSave = (index) => {

    const editedTask = tasks[index];

    console.log('Saving edited data:', editedTask);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedTask),
    };

    
  
    fetch(`http://localhost:8000/editTask.php?id=${editedTask.id}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: editedTask.id,
    taskName: editedTask.taskName,
    assignee: editedTask.assignee,
    dueDate: editedTask.dueDate,
    estimatedTime: editedTask.estimatedTime,
  }),
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data); // Log response from the backend
    // Optionally, you can update the frontend state or show a success message to the user
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle errors here (e.g., show an error message to the user)
  });
    setEditIndex(-1); 
  };

  const handleIconClick = (event, index,task) => {
    event.stopPropagation(); 
    
    console.log('Icon clicked for task index:', index ,task.assignee,task.dueDate);
    
  };
  const handleDeleteTask = (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (confirmDelete){
    fetch(`http://localhost:8000/deleteTask.php?id=${taskId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // If the response is successful, remove the task from the frontend state
        setTasks(tasks.filter(task => task.id !== taskId));
        console.log('deleeted sueceefully');
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors here (e.g., show an error message to the user)
      });
        }
  };

  const toggleCalendarVisibility = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleCommentChange = (e) => {
    setTempComment(e.target.value);
};

const handleCommentSubmit = () => {
 
  const updatedTask = { ...selectedTask };
  updatedTask.comments = updatedTask.comments || [];
  updatedTask.comments.push({ text: tempComment, timestamp });
  setSelectedTask(updatedTask);
  setTempComment('');

  const commentData = {
    taskId: selectedTask.id,
    comment: { text: tempComment, timestamp },
}

const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentData),
};
console.log('body:', requestOptions.body);

fetch('http://localhost:8000/saveComment.php', requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Log response from the backend
        // Optionally, you can update the frontend state or show a success message to the user
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors here (e.g., show an error message to the user)
    });
};

const toggleDoToday = (index) => {
  setDoTodayOpen(!isDoTodayOpen);
};


  
  function logoutSubmit(){
    const confirmDelete = window.confirm("Are you sure you want to log out?");
    if(confirmDelete){
    localStorage.setItem("login","");
    localStorage.setItem("loginStatus","Logged out succesfully")
      naviget("/")
    }
  };
  const handleAssigneeChange = (e, index ,field) => {
    handleInputChange(e, index, field);
    handleSave(index);
    setEditIndex(-1); // Reset editIndex to -1 when assignee is selected
};



  return (
    /*
       


    */

    <div className="app ">
   <div className={` z-10 top-[71px] transition-transform duration-300 ease-in-out ${isRightSidebarOpen ? "transform translate-x-0" : "transform translate-x-full"} fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg`}>
  {selectedTask && (
    <div className="p-4">
      <button className="text-gray-600 hover:text-gray-900" onClick={(event) => toggleRightSidebar(event)}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
      <h2 className="mt-4 text-xl font-semibold">{selectedTask.taskName}</h2>
      <p className="mt-2 text-gray-700">Assignee: {selectedTask.assignee}</p>
      <p className="mt-2 text-gray-700">Due Date: {selectedTask.dueDate}</p>
      <p className="mt-2 text-gray-700">Estimated Time: {selectedTask.estimatedTime}</p>

      {selectedTask.comments && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800">Comments</h3>
          <ul className="mt-2 space-y-2">
            {selectedTask.comments.map((comment, index) => (
              <li key={index} className="p-2 border rounded-md bg-gray-50">
                <span className="block text-sm text-gray-600">{comment.timestamp}</span>
                <span className="block mt-1 text-gray-800">{comment.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <input
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          type="text"
          name="comment"
          required="required"
          placeholder="Enter a Comment"
          value={tempComment}
          onChange={handleCommentChange}
        />
        <button
          className="mt-2 w-full p-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCommentSubmit}
          disabled={!tempComment.trim()}
        >
          Submit Comment
        </button>
      </div>
    </div>
  )}
</div>


   
    <Header toggleSidebar={toggleSidebar} />
    <Sidebar  isSidebarOpen={isSidebarOpen} tasks={tasks} toggleAddFormVisibility={toggleAddFormVisibility}  />
   
 
  
  <div className="main-content">
  <div className="ml-64 pl-5 mt-10 mb-2" >
     
  <h1>Welcome, {username}! </h1>
  
 

    <h1 className=" mb-0 text-xl font-bold">My tasks</h1>
    <ul className="flex list-none p-0 m-0">
    <li className="mr-5">
      <h5 className="text-lg font-medium cursor-pointer hover:text-gray-700">List</h5>
    </li>
    <li className="mr-5">
      <h5 className="text-lg font-medium cursor-pointer hover:text-gray-700">Board</h5>
    </li>
    <li className="mr-5">
      <h5 className="text-lg font-medium cursor-pointer hover:text-gray-700">Calendar</h5>
    </li>
    <li className="mr-5">
      <h5 className="text-lg font-medium cursor-pointer hover:text-gray-700">Files</h5>
    </li>
  </ul>
  <hr className="my-0 mb-8 border-gray-300" />
    
    
    <button onClick={toggleAddFormVisibility}  type="button" class="text-white bg-gray-900 hover:bg-gray-700 focus:ring-1 focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add a Task</button>
    



    <div class=" mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50  dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                  Task Name
                </th>
                <th scope="col" class="px-6 py-3">
                   Assignee
                </th>
                <th scope="col" class="px-6 py-3">
                    Duedate
                </th>
                <th scope="col" class="px-6 py-3">
                    EstimatedTime
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Delete</span>
                </th>
            </tr>
        </thead>
        <tbody>
           {tasks.map((task, index) => (
             <React.Fragment key={task.id}>
            <tr onClick={() => setEditIndex(index)} class="bg-white border-b dark:bg-gray-800   hover:bg-gray-50 dark:hover:bg-gray-600">
               {editIndex === index ? (
                <>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <input className='taskName' value={task.taskName} onChange={(e) => handleInputChange(e, index, 'taskName')} onKeyPress={(e) => handleKeyPress(e, index)} />
                </th>
                <td class="px-6 py-4">
                     <select   value={task.assignee} onChange={(e) => handleAssigneeChange(e, index, 'assignee')}>
            
                    {availableUsers.map(user => (
                  <option key={user.id} value={user.user}>{user.user}</option>
                  ))}
                  </select>
                </td>
                <td class="px-6 py-4">
                   <input  value={task.dueDate} onChange={(e) => handleInputChange(e, index, 'dueDate')} onKeyPress={(e) => handleKeyPress(e, index)} />
                </td>
                <td class="px-6 py-4">
                   <input value={task.estimatedTime} onChange={(e) => handleInputChange(e, index, 'estimatedTime')} onKeyPress={(e) => handleKeyPress(e, index)} />
                </td>
                </>
                ) : (
                   <>
                     <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"> <div className="task-name-container">
                     {task.taskName}
                     <button className="icon-button" onClick={(event) => toggleRightSidebar(event, task)}>
                      <FontAwesomeIcon icon={faArrowRight} />
                     </button>
                      </div></th>
                     <td class="px-6 py-4">{task.assignee}</td>
                      <td class="px-6 py-4">{task.dueDate}</td>
                      <td class="px-6 py-4">{task.estimatedTime}</td>
                  
                <td class="px-6 py-4 text-right">
                    <a href="#"  onClick={() => handleDeleteTask(task.id)} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                </td>
                </>
            )}
          </tr>
           
                  
             </React.Fragment>
           ))}

            
           
        </tbody>
    </table>
</div>


      {isAddFormVisible &&(
         <form onSubmit={handleAddFormSubmit}>

         <input type='text' name="taskName" required ="required" placeholder='Enter a task' onChange={handleAddFormchange}/>
         <input type='text' name="assignee"required ="required"  placeholder='Enter a Assignee'onChange={handleAddFormchange}/>
         <input type='text' name="dueDate" required ="required" placeholder='Enter a Duedate' value={selectedDate ? selectedDate.toDateString() : ''} onChange={handleAddFormchange}/>
         
           <button onClick={toggleCalendarVisibility}><FontAwesomeIcon icon={faCalendar} /></button>

             {isCalendarVisible && (
              <div className="calendar-container">
                 <DatePicker
                 selected={selectedDate}
                 onChange={handleDateChange}
                 inline
               />
             </div>
            )}
       

         <input type='text' name="estimatedTime" required ="required" placeholder='Enter a Estimated Time' onChange={handleAddFormchange}/>
         <button  type='submit'>Add</button>
         <button className="icon-button-remove" onClick={toggleAddFormVisibility}>
         <FontAwesomeIcon icon={faTimes} />
         </button>
       </form>
       
      ) }   
 
     {  sectionName.map((section, sectionIndex) => (
             userId == section.user_id && (
              <>
             <React.Fragment key={section.id}>
                 <h4 className="flex items-center mt-8 mb-4">
        <button
          className="  bg-none border-none cursor-pointer p-0 mr-2"
          onClick={  toggleDoToday }
        >
          <FontAwesomeIcon icon={isDoTodayOpen ? faCaretDown : faCaretRight} />
        </button>
        {section.section_name}
      </h4>
      
                  
                <div class=" mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                  Task Name
                </th>
                <th scope="col" class="px-6 py-3">
                   Assignee
                </th>
                <th scope="col" class="px-6 py-3">
                    Duedate
                </th>
                <th scope="col" class="px-6 py-3">
                    EstimatedTime
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Delete</span>
                </th>
            </tr>
        </thead>
        <tbody>
                    {section.tasks && section.tasks.map((task, taskIndex) => (
                        <React.Fragment key={task.id}>
                            <tr onClick={() => setEditIndex({ sectionIndex, taskIndex })} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                {editIndex?.sectionIndex === sectionIndex && editIndex?.taskIndex === taskIndex ? (
                                    <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input
                                                className='taskName'
                                                value={task.taskName}
                                                onChange={(e) => handleTaskInputChange(e, sectionIndex, taskIndex, 'taskName')}
                                                onKeyPress={(e) => handleKeyPressS(e, sectionIndex, taskIndex)}
                                            />
                                        </th>
                                        <td className="px-6 py-4">
                                            <p>secure</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                value={task.dueDate}
                                                onChange={(e) => handleTaskInputChange(e, sectionIndex, taskIndex, 'dueDate')}
                                                onKeyPress={(e) => handleKeyPressS(e, sectionIndex, taskIndex)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                value={task.estimatedTime}
                                                onChange={(e) => handleTaskInputChange(e, sectionIndex, taskIndex, 'estimatedTime')}
                                                onKeyPress={(e) => handleKeyPressS(e, sectionIndex, taskIndex)}
                                            />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="task-name-container">
                                                {task.taskName}
                                                <button className="icon-button" onClick={(event) => toggleRightSidebar(event, task)}>
                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                </button>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">{task.assignee}</td>
                                        <td className="px-6 py-4">{task.estimatedTime}</td>
                                        <td className="px-6 py-4">{task.dueDate}</td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" onClick={() => handleDeleteTask(sectionIndex, taskIndex)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                                        </td>
                                    </>
                                )}
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
               </table>
        </div>
        <form onSubmit={(e) => handleTaskAddFormSubmit(e, sectionIndex)}>
        <div className="flex flex-wrap  mt-2">
                    <input
                      className=' mr-4'
                        type='text'
                        name="taskName"
                        required="required"
                        placeholder='Enter a task name'
                        value={addFormData.taskName}
                        onChange={(e) => handleAddFormchange(e)}
                    />
                    <input
                        type='text '
                        name="assignee"
                        required="required"
                        placeholder='Enter a assignee'
                        value={addFormData.assignee}
                        onChange={(e) => handleAddFormchange(e)}
                    />
                   <input type='text' name="dueDate" required ="required" placeholder='Enter a Duedate' value={selectedDate ? selectedDate.toDateString() : ''} onChange={handleAddFormchange}/>
         
                      <button onClick={toggleCalendarVisibility}><FontAwesomeIcon icon={faCalendar} /></button>

                      {isCalendarVisible && (
                         <div className="calendar-container">
                         <DatePicker
                         selected={selectedDate}
                         onChange={handleDateChange}
                         inline
                           />
                             </div>
                         )}
                     <input
                        type='text'
                        name="estimatedTime"
                        required="required"
                        placeholder='Enter Estimated Time'
                        value={addFormData.estimatedTime}
                        onChange={(e) => handleAddFormchange(e)}
                    />
                    
                    <button type="submit">Add Task</button>
                    </ div>
                </form>

                

                </React.Fragment>
                
                </>
             )
                
           ))}
         


      <form onSubmit={ (e)=> handleAddFormSubmitse(e,userId)} class = "mt-8">
      <input type='text' name="section_name" required ="required" placeholder='Add a section'  onChange={handleAddFormchange}/>
      <button  type='submit'>Add</button>
      </form>



  
     
     <button  onClick={logoutSubmit} type="button" class=" mt-4 text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-600 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Logout</button>
    </div>

   
  </div>
  
  
</div>
  

  )
}
