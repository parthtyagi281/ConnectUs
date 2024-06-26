import "./messanger.css"
import Navbar from "../../components/Navbar/Navbar"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message";
import Chatonline from "../../components/ChatOnline/Chatonline";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

import { useDispatch } from "react-redux/es/exports";
import { useRef } from "react"
import { io } from "socket.io-client"
import { useNavigate } from "react-router-dom";

export default function Messanger() {
    const navigate = useNavigate();
    const scrollRef = useRef();
    const dispatch = useDispatch();
    const [currChat, setCurrChat] = useState(null);
    const [messages, setMessages] = useState([])
    const [conversations, setConversations] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const currUser = useSelector((state) => state.user.user);
    const socket = useRef()
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [fr,setFr] = useState("");
    const [searchKeyword,setSearchKeyword] = useState("");

    const isMessageDeleted = () => {
        getMessages();
        return;
    }

    useEffect(() => {
        arrivalMessage && currChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currChat])

    // to send some thing to server
    useEffect(() => {
        if (Object.keys(currUser).length !== 0) {
            socket.current?.emit("addUser", currUser._id);
            socket.current?.on("getUsers", users => {
                setOnlineUsers(currUser.following.filter(f => users.some(u => f === u.userId)));
            })
        }
        // (currUser.following !== undefined) && socket.current?.on("getUsers", users => {
        //     setOnlineUsers(currUser.following.filter(f => users.some(u => f === u.userId)));
        // });
        // socket.current?.on("getUsers",users=>{
        //     console.log("hii");
        //     console.log(users);
        // })
    }, [currUser])

    useEffect(() => {
        if (!localStorage.getItem("auth-token")) {
            navigate("/login");
        }
        else {
            socket.current = io(`${process.env.REACT_APP_SOCKET_URL}`)
            socket.current.on("getMessage", (data) => {
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: Date.now()
                })
            })
        }
    }, [])

    useEffect(() => {
        const getConversation = async () => {
            const url = `${process.env.REACT_APP_BASE_URL}api/conversation/${currUser._id}`
            let response = await fetch(url, {
                method: "GET"
            })
            response = await response.json();
            if (response.success === true) {
                setConversations(response.conversations);
            }
        }

        getConversation();
    }, [currUser])


    const getMessages = async () => {
        const url = `${process.env.REACT_APP_BASE_URL}api/message/${currChat._id}`
        let response = await fetch(url, {
            method: "GET"
        })
        response = await response.json();
        if (response.success === true) {
            setMessages(response.messages);
        }
    }

    useEffect(() => {
        currChat && getMessages();
    }, [currChat, messages.length])

    // to scroll automatically
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length])

    const recieverid = currChat?.members.find(m => m !== currUser._id);

    const handleSend = async (e) => {
        e.preventDefault();
        if (newMessage !== "") {
            const message = {
                text: newMessage,
                sender: currUser._id.toString(),
                conversationId: currChat._id.toString()
            }
            const url = `${process.env.REACT_APP_BASE_URL}api/message`;
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(message)
            })
            response = await response.json();
            if (response.success === true) {
                setMessages((prev) => [...prev, response.message]);
                setNewMessage("");
                await socket.current.emit("sendMessage", {
                    senderId: currUser._id,
                    recieverId: recieverid,
                    text: newMessage
                })
            }



        }
    }




    return conversations && (
        <div>
            <Navbar />
            {currChat&&<div className="z-50 w-[100%] left-0 md:w-[45%] md:left-[25%] h-[50px] text-[20px] py-[10px] font-medium bg-[#9dd1e181]  fixed text-black text-center cursor-pointer top-[50px] " onClick={()=>{navigate(`/profile/${fr._id}/${fr.name}`)}}>{fr.name}</div>}
            <div className="messangerContainer w-[100%]">
                <div className={!currChat ? "chatMenu  w-[40%] md:w-[25%]" : "hidden md:block md:w-[25%]"}>
                    <div className="chatMenuWrapper">
                        <input value={searchKeyword} onChange={(e)=>{setSearchKeyword(e.target.value)}} placeholder="Search for friends" className="chatMenuInput" />
                        {
                            conversations.map((c) => {
                                return (
                                    <div key={c._id} onClick={() => { setCurrChat(c) }}>
                                        <Conversation searchKeyword={searchKeyword} setfr={setFr} conversation={c} currUser={currUser} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={!currChat ? "chatBox w-[60%] md:w-[45%]" : "chatBox w-[100%] md:w-[45%]"}>
                    {
                        currChat ?
                            <div className="">
                                <div className="p-[10px] w-[100%]">
                                    <div className="chatBoxTop gap-[20px]">
                                        {
                                            messages ? messages.map((m) => {
                                                return (
                                                    <div className={(m.sender === currUser._id) ? "flex justify-end w-[100%]" : "flex w-[100%]"} key={m._id} ref={scrollRef}>
                                                        <Message message={m} own={m.sender === currUser._id} isMessageDeleted={isMessageDeleted} />
                                                    </div>
                                                )
                                            }) :
                                                <div className="noConversation">Loading..</div>
                                        }
                                    </div>
                                    <div className="chatBoxBottom ">
                                        <textarea value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} className="chatMessageInput w-[70%] md:w[80%]" placeholder="Write something...">

                                        </textarea>
                                        <button className="chatSubmitButton" onClick={handleSend}>
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div> :
                            <span className="noConversation text-[24px] md:text-[36px]">Start conversation with your friends...</span>
                    }
                </div>
                <div className="hidden md:flex md:w-[30%]">
                    <div className="chatOnlineWrapper">
                        <Chatonline onlineUsers={onlineUsers} currUser={currUser} setCurrChat={setCurrChat} />
                    </div>
                </div>
            </div>
        </div>
    )
}
