import "./message.css"
import { format } from "timeago.js"
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MoreVert, NavigateNextTwoTone } from "@mui/icons-material"

export default function Message({ message, own, isMessageDeleted }) {
  const [sender, setSender] = useState(null);
  const [showDelete, setshowDelete] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      const url = `${process.env.REACT_APP_BASE_URL}api/user/get-user-by-id/${message.sender}`
      let response = await fetch(url, {
        method: "GET"
      })
      response = await response.json();
      if (response.success === true) {
        setSender(response.user);
      }
    }

    getUser();
  }, [message._id])

  const pf = process.env.REACT_APP_PUBLLC_FOLDER;

  const deleteMessage = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}api/message/delete/message/${message._id}`
    let response = await fetch(url, {
      method: "DELETE",
      headers: {
        'Content-Type': "application/json",
        'auth-token': localStorage.getItem("auth-token"),
      },
    })
    response = await response.json();
    if (response.success === true) {
      console.log(response);
      isMessageDeleted();
    }
  }

  return (
    <div className="flex relative">
      <div className={own?"flex items-start justify-end":"flex items-start justify-start"}>
        {/* <Link to={`/profile/${sender && sender._id}/${sender && sender.name}`}>
          <img className="rounded-[50%] w-[30px] h-[30px]" src={sender && sender.profilePicture ? pf + sender.profilePicture : `${pf}profile.jpg`} alt="" />
        </Link> */}
        <div className={own?"flex flex-col max-w-[80%] ":"flex flex-col max-w-[80%] "}>
          <div className="w-[100%] text-[15px] text-white">
            <p className={own?"colown rounded-md w-[100%] px-[10px] break-normal":"break-normal coloth rounded-md w-[100%] px-[10px]"} >{message.text}</p>
          </div>
          <div className={own ? "flex justify-end text-[10px]" : "flex justify-start text-[10px]"}>
            {format(message.createdAt)}
          </div>
        </div>
        <MoreVert style={{ fontSize: "15px",cursor:"pointer" }} onClick={() => { setshowDelete(!showDelete) }} />
        {
          showDelete && <button className="cursor-pointer text-[13px] p-[5px] absolute top-[15px] right-0 hover:font-medium" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", color: "black", borderRadius: "5px", outline: "none", cursor: "pointer" }} onClick={() => { deleteMessage() }}>Delete</button>
        }
      </div>
    </div>
  )
}
