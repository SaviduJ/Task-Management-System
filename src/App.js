import logo from './logo.svg';
import './App.css';
import Registration from './Registration';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Protected from './Protected';
import Users from './Users';
import Projects from './Projects';


function App() {
  return (

    <>
    
   
   <BrowserRouter>
      <Routes>
        <Route path='/users' element={<Users/>}/>
      <Route path='/registration' element={<Registration/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Protected Component={Dashboard}/>}/>
        <Route path='/projects' element={<Projects/>}/>
      </Routes>
   </BrowserRouter>

  
   </>
  );
}

export default App;
