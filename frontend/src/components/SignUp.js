import React, { useState, useEffect } from 'react';
const axios=require('axios').default;

function SignUp({Login,Logerror,error,check}) {
    const [signupdetails,setDetails]=useState({name:"",email:"",position:"",password:""});
    async function Register(event) {
        event.preventDefault();
        if(signupdetails.email==="" || signupdetails.password===""||signupdetails.name===""||signupdetails.position==="")
        {Logerror("Please Fill all Required Fields")}
        else{
        const response = await axios.post("http://localhost:8070/employee/register", {
            name:signupdetails.name,
            email:signupdetails.email,
            position:signupdetails.position,
            password:signupdetails.password
        }).then(function(response){
          const data=response.data
          
          localStorage.setItem('user',JSON.stringify(data))
          Login(data)
        }).catch(function(err){
          Logerror("User already Exists")
        });
      }
      }

              //added by Malaka, will change your project page title - delete after read :)
  useEffect(() => {
    document.title = "PROJECT SIGN UP"
  }, [])
    return (
      <div>
   <form className="col-12 " onSubmit={Register}>
        <div className="col-2 offset-5  text-danger">{error}</div>
        <div className="form-group mt-3 col-2 offset-5">
       <label for="name">Username :</label>
       <input  className="form-control" onChange={e => setDetails({...signupdetails,name:e.target.value})} value={signupdetails.name} type="text" placeholder="Username"/>
       </div>
       <div className="form-group mt-3 col-2 offset-5 ">
       <label for="email">E-mail :</label>
       <input  className="form-control" onChange={e => setDetails({...signupdetails,email:e.target.value})} value={signupdetails.email} type="text" placeholder="Email"/>
       </div>
       <div className="form-group mt-3 col-2 offset-5 ">
       <label for="posistion">Position :</label>
       <input  className="form-control" onChange={e => setDetails({...signupdetails,position:e.target.value})} value={signupdetails.position} type="text" placeholder="Position"/>
       </div>
       <div className="form-group mt-3 col-2 offset-5">
       <label for="password">Password :</label>
       <input className="form-control" onChange={e => setDetails({...signupdetails,password:e.target.value})} value={signupdetails.password} type="password" placeholder="Password"/>
       </div>
       <br />
       <input type="submit" className="btn btn-outline-dark col-2 offset-5" value="Sign Up" />
       
       <input type="button"className="btn btn-dark mt-3 col-2 offset-5" value ="Already a User? Login" onClick={check}/>
     </form>
      </div>
     
    )
}

export default SignUp
