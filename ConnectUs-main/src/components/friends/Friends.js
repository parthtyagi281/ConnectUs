import "./friends.css"
import { useNavigate } from "react-router-dom";
 
export default function Friends(props) {
    const navigate= useNavigate();
    const pf = process.env.REACT_APP_PUBLLC_FOLDER;

    return (
        <li onClick={()=>{navigate(`/profile/${props.user._id}/${props.user.name}`)}} className='sidebarFriendsListItem'>
            <img src={props.user.profilePicture?pf+props.user.profilePicture:`${pf}profile.jpg`} alt="Image" className='sidebarFriendImage' />
            <span className='sidebarFriendImageText'>{props.user.name}</span>
        </li>
    )
}
