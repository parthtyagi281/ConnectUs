import "./setPassword.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import PostContext from "../../Context/post/PostContext";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

export default function SetPassword() {
  const context = useContext(PostContext);
  const { notify } = context;
  const [progress, setProgress] = useState(false);
const [pass,setPass]= useState("");
const [confirmPassword,setConfirmPassword] = useState("");
const token=useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      navigate("/")
    }
  }, []);


  const isSame = () => {
    if (pass === confirmPassword || confirmPassword.length === 0) {
      return true;
    }
    else {
      return false;
    }
  }

  const handleClick = async (e) => {
    e.preventDefault();
    if(isSame()===false)
    {
        return ;
    }
    setProgress(true);
    const data={
        password:pass
    }
    const url=`${process.env.REACT_APP_BASE_URL}api/auth-mail/acceptUser/${token.token}`;
    let response = await fetch(url,{
        method:"post",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    })
    response = await response.json();
    if(response.success)
    {
        notify("success",response.message);
        navigate("/login");
    }
    else
    {
        notify("error",response.message);
    }
    setProgress(false);
  }


  return (
    <div className="bg-[#e1f4fa] min-w-[100vw] min-h-[100vh] flex justify-center items-center">
      <div className="flex flex-col sm:flex-row">
        <div className="left flex flex-col justify-center max-[641px]:items-center sm:pl-[20px] w-[100%] sm:w-[50%]">
          <h4 className="registerLogo text-[36px] sm:text-[55px] font-medium">
            ConnectUs
          </h4>
          <div className="text-[15px] sm:text-[24px] max-[641px]:text-center font-medium w-[90%] sm:w-[70%]">
            Connect with friends and the world around you on ConnectUs.
          </div>
        </div>
        <div className="flex justify-center items-center mt-[20px] w-[100%] sm:w-[50%]">
          <form className="gap-[20px] flex flex-col p-[20px] bg-white rounded-[10px] w-[80%]" onSubmit={handleClick}>
            {/* <input autoComplete="on" onChange={(e) => { setName(e.target.value) }} value={name} minLength="6" required={true} className="registerInput" type="text" placeholder="Username" name="name" />
            <input autoComplete="on" onChange={(e) => { setEmail(e.target.value) }} value={email} required={true} className="registerInput" type="email" placeholder="Email" name="email" /> */}
            <input autoComplete="on" onChange={(e)=>{setPass(e.target.value)}} value={pass} minLength="6" required={true} className="registerInput" type="password" placeholder="Password" name="password" />
            <input autoComplete="on" onChange={(e)=>{setConfirmPassword(e.target.value)}} value={confirmPassword} minLength="6" required={true} className="registerInput" type="text" placeholder="Confirm Password" name="confirmPassword" />
            {
              !isSame() && <div style={{ textAlign: "center", color: "red" }}>
                Password and Confirm Password does not match!
              </div>
            }
            <button required={true} className="registerButton" type="Submit"> {progress ? <div style={{
              height
                : "80%", display: "flex", justifyContent: "center", alignItems: "center"
            }}><CircularProgress style={{ color: "white" }} /></div> : "Continue"} </button>
          </form>
        </div>
      </div>
    </div>
  )
}
