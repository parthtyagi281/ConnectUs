import React from 'react'
import "./sidebar.css"
import Friends from '../friends/Friends'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  RssFeed,
  Chat,
} from '@mui/icons-material'

export default function Sidebar() {
  const navigate=useNavigate();
  const chatClickHandler=(e)=>{
    e.preventDefault();
    navigate("/messanger");
  }

  const user=useSelector(state=>state.user.user);

 
  return (
    <div className='sideBarContainer'>
      <div className="sidebarWrapper">
        <ul className='sidebarList'>
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem" onClick={chatClickHandler} >
            <Chat className="sidebarIcon"  />
            <span className="sidebarListItemText">Chats</span>
          </li>
        </ul>
        <button className="sidebarButton">
          Show More
        </button>
        <hr className='sidebarHr' />
        <ul className='sidebarFriendsList'>
          {
            user.following?.map((u,index)=>{
              return <Friends key={index} user={u}/>
            })
          }
        </ul>
      </div>
    </div>
  )
}
