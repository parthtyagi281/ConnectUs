import "./online.css"
import { useNavigate } from "react-router-dom";


export default function Online(props) {
    const navigate = useNavigate();
    const pf=process.env.REACT_APP_PUBLLC_FOLDER;

    const onclickhandler=(e)=>{
        e.preventDefault();
        navigate(`/profile/${props.user._id}/${props.user.name}`)
    }

    return (
        <li className="onlineFriend" onClick={onclickhandler}>
            <div className="onlineFriendProfileContainer"  >
                <img src={props.user.profilePicture?pf+props.user.profilePicture:`${pf}profile.jpg`} alt="" className="onlineFriendProfileImg"  />
                <span className='rightbarOnlineIcon'></span>
            </div>
            <span className="onlineFriendProfile">{props.user.name}</span>
        </li>
    )
}
