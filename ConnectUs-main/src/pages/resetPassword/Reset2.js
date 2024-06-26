import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import PostContext from "../../Context/post/PostContext";
import "./reset.css"
import { CircularProgress } from "@mui/material";

export default function Reset2() {
    const context=useContext(PostContext);
    const {passwordChange,notFound,ServerError,notify}=context;
    const [render,setRender]=useState(false);
    const [progress,setProgress] = useState(false);
    const navigate = useNavigate();
    const [email,setEmail]=useState("");
   
    

    useEffect(()=>{
        if(localStorage.getItem("auth-token"))
        {
            navigate(-1);
        }
        else
        {
            setRender(true);
        }
    },[])

    const sendMail=async (e)=>{
        e.preventDefault();
        setProgress(true);
        const data={
            email:email
        }
        const url=`${process.env.REACT_APP_BASE_URL}api/auth-mail/password-generate-link`
        let response=await fetch(url,{
            method:"post",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data)
        })
        response=await response.json();
        console.log(response);
        if(response.success)
        {
            setProgress(false);
            navigate(`/Confirmation_page/${email}`);
        }
        else
        {
            notify("error",response.message);
            setProgress(false);
        }
    }


    

    return render&&(
        <div className="bg-[#e1f4fa] min-w-[100vw] min-h-[100vh] flex justify-center items-center">
            <div className="flex flex-col sm:flex-row">
                <div className="left flex flex-col justify-center max-[641px]:items-center sm:pl-[20px] w-[100%] sm:w-[50%]">
                    <h4 className="resetLogo text-[36px] sm:text-[55px] font-medium">
                        ConnectUs
                    </h4>
                    <div className="text-[15px] sm:text-[24px] max-[641px]:text-center font-medium w-[90%] sm:w-[70%]">
                        Connect with friends and the world around you on ConnectUs.
                    </div>
                </div>
                <div className="flex justify-center items-center mt-[20px] w-[100%] sm:w-[50%]">
                    <form className="gap-[20px] flex flex-col p-[20px] bg-white rounded-[10px] w-[80%]" onSubmit={sendMail}>
                        <input value={email} autoComplete="on" required={true} className="resetInput" type="email" placeholder="Email" name="email" onChange={(e)=>{setEmail(e.target.value)}} />
                        <button required={true} className="resetButton" type="Submit">{progress?<div style={{height
                        :"80%",display:"flex",justifyContent:"center",alignItems:"center"}}><CircularProgress style={{color:"white"}} /></div>:"Continue"}</button>
                        <button required={true} className="resetButton" onClick={() => {
                            navigate("/login")
                        }} type="button">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
