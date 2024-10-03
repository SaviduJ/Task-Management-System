import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StyleLogin.css'

function Login(){
   const naviget = useNavigate();
   const[user,setUser]=useState("");
   const[pass,setPass]=useState("");
   const[error,setError]=useState("");
   const[msg,setMsg]=useState("");


   useEffect(()=>{
      let login = localStorage.getItem("login");
      if(login){
         naviget("/dashboard");
      }
      let loginStatus = localStorage.getItem("loginStatus")
      if(loginStatus){
         setError(loginStatus);
         setTimeout(function(){
            localStorage.clear();
            window.location.reload();
         },3000);
         
      }
      setTimeout(function(){
         setMsg("");
      },5000);
   },[msg,naviget]);


 const handleInputChange=(e,type)=>{
     switch(type){
       case"user":
         setError("")
         setUser(e.target.value);
         if(e.target.value===""){
             setError("Username has left blank");  
         }
         break;
         case"pass":
         setError("")
         setPass(e.target.value);
         if(e.target.value===""){
             setError("Password has left blank");  
         }
         break;
         default:



     }
  }

 /* function loginSubmit(){
     if(user !=="" && pass !==""){
       var url ="http://localhost:8000/login.php";
       var headers={
         "Accept":"application/json",
         "Content-type":"application/json"
       };
       var Data={
          user: user,
          pass:pass
       };
       fetch(url,{
          method:"POST",
          headers:headers,
          body:JSON.stringify(Data)
       }).then((response)=>response.json())
          .then((response)=>{
            if(response[0].result ==="Invalid username" ||response[0].result ==="Invalid password"){
               setError(response[0].result);
            }else{
               setMsg(response[0].result);
               setTimeout(function(){
                  localStorage.setItem("login",true);
                 
                   naviget("/dashboard")
               },5000);
            }
          }).catch((err)=>{
             setError(err);
             console.log(err);
          })

     }else{
       setError("All Feilds are Required")
     }
  }*/

     function loginSubmit() {
      if (user !== "" && pass !== "") {
         var url = "http://localhost:8000/login.php";
         var headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
         };
         var Data = {
            user: user,
            pass: pass
         };
         fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(Data)
         }).then((response) => response.json())
            .then((response) => {
               if (response[0].result === "Invalid username" || response[0].result === "Invalid password") {
                  setError(response[0].result);
               } else {
                  setMsg(response[0].result);
                  setTimeout(function () {
                     localStorage.setItem("login", true);
                     localStorage.setItem("username", user);
                     localStorage.setItem("user_roleId", response.user_roleId);
                     localStorage.setItem("id", response.id);
                     localStorage.setItem("permissions", JSON.stringify(response.permissions));
                     
                     naviget("/dashboard");
                  }, 2000);
               }
               console.log(response);
            }).catch((err) => {
               setError(err);
               console.log(err);
            })

      } else {
         setError("All Fields are Required")
      }
   }

 

   return(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
     <div className='form'>
         <p style={{color: 'blue', cursor: 'pointer'}}>
            {
               error !==""?
            <span className='error'>{error}</span>:
            <span className='success'>{msg}</span>

            }
         </p>
          <label>Username</label>
          <input
              type="text"
              value={user}
              onChange={(e)=>handleInputChange(e,"user")}
              style={{
               marginTop: '0.5rem',
               fontSize: '1rem',
               width: '300px',
               border: '1px solid gray',
               borderRadius: '5px',
               padding: '0.5rem'
             }}
             
         />
          <label>Password</label>
          <input
              type="password"
              value={pass}
              onChange={(e)=>handleInputChange(e,"pass")}
              style={{
               marginTop: '0.5rem',
               fontSize: '1rem',
               width: '300px',
               border: '1px solid gray',
               borderRadius: '5px',
               padding: '0.5rem'
             }}
         />
         <label></label>
         <input
            type='submit'
            defaultValue="Login"
            className='button'
            onClick={loginSubmit}
            style={{
               marginTop: '0.5rem',
               fontSize: '1rem',
               width: '300px',
               border: '1px solid gray',
               borderRadius: '5px',
               padding: '0.5rem'
             }}
         />
     </div>
  </div>

   )



}
export default Login;