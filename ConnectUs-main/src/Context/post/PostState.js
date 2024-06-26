import PostContext from "./PostContext";
import { useDispatch } from "react-redux";
import { deletePost } from "../../redux/post/postAction";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";

export default function PostState(props) {
    const dispatch=useDispatch();
    const deletePostFn=async (id)=>{
        dispatch(deletePost(id));
        const url=`${process.env.REACT_APP_BASE_URL}api/user/post/delete/${id}`
        let response=await fetch(url,{
            method:"DELETE",
            headers: {
                'Content-Type': "application/json",
                'auth-token': localStorage.getItem("auth-token"),
            },
        })
        response=await response.json();
        console.log(response);
    }


    // pop up

    const loginSuccess=()=>{
        toast.success("Successfully Login!");
    }

    const ServerError=()=>{
        toast.error("Internal Server Error!")
    }

    const loginFail=()=>{
        toast.error("Invalid Credentials!");
    }

    const logoutSuccess=()=>{
        toast.success("Successfully Logged Out!");
    }

    const profileUpdated=()=>{
        toast.success("Profile is Updated Successfully!");
    }

    const UserAlreadyExist=()=>{
        toast.warning("Email is in use already!");
    }

    const registerSuccess=()=>{
        toast.success("Account is created successfully!");
    }

    const passwordChange=()=>{
        toast.success("Password is changed successfully!");
    }

    const notFound=()=>{
        toast.warning("User is not found!");
    }

    const notify=(type,message)=>{
        if(type==="success")
        {
            toast.success(message);
        }
        else if(type==="error")
        {
            toast.error(message);
        }
        else if(type==="info")
        {
            toast.info(message);
        }
        else if(type==="warning")
        {
            toast.warning(message);
        }
    }

    // online friends
    const [of,setOf]=useState([]);

    return (

        <PostContext.Provider value={{deletePostFn,loginSuccess,ServerError,loginFail,logoutSuccess,profileUpdated,UserAlreadyExist,registerSuccess,passwordChange,notFound,of,setOf,notify}}>
            {props.children}
        </PostContext.Provider>

    )
}


