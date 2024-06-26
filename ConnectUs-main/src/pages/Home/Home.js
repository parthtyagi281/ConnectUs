import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import RightBar from "../../components/rightbar/RightBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./home.css";
import { getUser } from "../../redux/user/userAction";

export default function Home() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  useEffect(()=>{
    if(!localStorage.getItem("auth-token"))
    {
      navigate("/login");
    }
    else
    {
      dispatch(getUser());
    }

  },[])

  if (localStorage.getItem("auth-token"))
    return (
      <div>
        <Navbar />
        <div className="homeContainer">
          <div className="hidden md:block w-[23%]">
            <Sidebar />
          </div>
          <div className="w-[100%] md:w-[46%]">
            <Feed right={false} />
          </div>
          <div className="hidden md:block w-[31%]">
            <RightBar />
          </div>
        </div>
      </div>
    );
  else {
    
  }
}
