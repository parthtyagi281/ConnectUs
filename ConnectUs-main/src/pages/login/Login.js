import "./login.css"
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import PostContext from "../../Context/post/PostContext";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { fetchUserSuccess } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch=useDispatch();
  const [progress, setProgress] = useState(false);
  const context = useContext(PostContext);
  const { loginSuccess, loginFail, ServerError } = context;
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      navigate("/")
    }
  }, [])

  const handleClick = async (e) => {
    e.preventDefault();
    setProgress(true);
    const url = `${process.env.REACT_APP_BASE_URL}api/user/auth/login`
    const data = {
      email: email.current.value,
      password: password.current.value
    }
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    })
    response = await response.json();
    if (response.success === true) {
      localStorage.setItem("auth-token", response.token);
      dispatch(fetchUserSuccess(response.user));
      navigate("/");
      loginSuccess();
      setProgress(false);
      return;
    }
    else {
      if (response.status === 500) {
        ServerError();
      }
      else {
        loginFail();
      }
      setProgress(false);
    }
  }

  return (
    <div className="bg-[#e1f4fa] min-w-[100vw] min-h-[100vh] flex justify-center items-center">
      <div className="flex flex-col sm:flex-row">
        <div className="left flex flex-col justify-center max-[641px]:items-center sm:pl-[20px] w-[100%] sm:w-[50%]">
          <h4 className="loginLogo text-[36px] sm:text-[55px] font-medium" >
            ConnectUs
          </h4>
          <div className="text-[15px] sm:text-[24px] max-[641px]:text-center font-medium w-[90%] sm:w-[70%]">
            Connect with friends and the world around you on ConnectUs.
          </div>
        </div>
        <div className="flex justify-center items-center mt-[20px] w-[100%] sm:w-[50%]">
          <form className="gap-[20px] flex flex-col p-[20px] bg-white rounded-[10px] w-[80%]" onSubmit={handleClick}>
            <input autoComplete="on" required={true} className="loginInput" type="email" placeholder="Email" name="email" ref={email} />
            <input autoComplete="on" minLength="6" required={true} className="loginInput" type="password" placeholder="Password" name="password" ref={password} />
            <button className="loginButton" type="Submit"> {progress ? <div style={{
              height
                : "80%", display: "flex", justifyContent: "center", alignItems: "center"
            }}><CircularProgress style={{ color: "white" }} /></div> : "Continue"}</button>
            <span className="loginForget" onClick={() => { navigate("/reset-password") }}>Forgot Password?</span>
            <button className="loginRegister" onClick={() => {
              navigate("/register")
            }} type="button" >Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  )
}
