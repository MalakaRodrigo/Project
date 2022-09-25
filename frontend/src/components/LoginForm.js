import React, {useState, useEffect} from 'react';
import './Login/login.css'

const axios = require('axios').default;


function LoginForm({Login, Logerror, error, check}) {
    const [logindetails, setDetails] = useState({email: "", password: ""});

    async function Auth(event) {
        event.preventDefault();
        if (logindetails.email === "" || logindetails.password === "") {
            Logerror("Please Fill all Required Fields")
        } else {
            const response = await axios.post("http://localhost:8070/employee/auth/", {
                email: logindetails.email,
                password: logindetails.password
            }).then(function (response) {

                const data = response.data;
                localStorage.setItem('user', JSON.stringify(data))
                Login(data)

            }).catch(function (err) {
                Logerror("User Not Exists")
            });
        }
    }

    //added by Malaka, will change your project page title - delete after read :)
    useEffect(() => {
        document.title = "PROJECT LOG IN"

    }, [])
    return (

        <div className="pos">
            <div className="loginform">
                <form onSubmit={Auth} className="subLoginForm">
                    <h1 className="loginformTitle">Welcome</h1>
                    <div className=" offset-2  text-danger">{error}</div>
                    <div className="form-group loginformtextbox ">
                        <label className="loginformlabels">E-mail :</label>
                        <input
                            className="loginFormTextInput"
                            onChange={(e) =>
                                setDetails({...logindetails, email: e.target.value})
                            }
                            value={logindetails.email}
                            type="text"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group loginformtextbox">
                        <label className="loginformlabels">Password :</label>
                        <input
                            className="loginFormTextInput"
                            onChange={(e) =>
                                setDetails({...logindetails, password: e.target.value})
                            }
                            value={logindetails.password}
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <br/>
                    <div className="loginformtextbox">
                        <input
                            type="submit"
                            className=" loginbutton"
                            value="Login"
                        />
                    </div>

                    {/*<input type="button" className="btn btn-outline-dark col-2 offset-5 mt-3" value="Create New Account" onClick={check} />*/}
                </form>
                <div className="subLogoLoginForm">
                    <img className="loginImage"src={require('../assests/images/loginImage.jpg').default}/>
                    {/*<div className="loginImage"></div>*/}
                </div>
            </div>
        </div>
    );

}

export default LoginForm