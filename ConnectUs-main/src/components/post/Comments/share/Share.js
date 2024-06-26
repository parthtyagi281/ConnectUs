import "./share.css"
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@mui/icons-material"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/exports";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function Share({postId,postComment}) {
    const pf = process.env.REACT_APP_PUBLLC_FOLDER;
    const [currPosts, setCurrPosts] = useState(useSelector(state => state.post.posts))
    const [desc, setDesc] = useState({ desc: "" });
    // getting the user
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("auth-token")) {
            navigate("/login");
        }
    }, [])



    const user = useSelector(state => state.user.user);

    const submitHandler = async (e) => {
        e.preventDefault();
        const comment = {
            text: desc.desc,
            userId: user._id
        }
        if (desc.desc === "") {
            console.log("there is nothing to comment\n");
        }
        postComment({comment,setDesc});
    }

    return (
        <div className="shareContainer">
            <div className="shareWrapper">
                <div className="shareTop">
                    <Link to={`/profile/${user._id}/${user.name}`}>
                        <img src={user.profilePicture ? pf + user.profilePicture : `${pf}profile.jpg`} alt="Image" className="shareImageIcon" />
                    </Link>
                    <input name="desc" value={desc.desc} placeholder={`Write Comment...`} className="shareInput" onChange={(e) => { setDesc({ ...desc, [e.target.name]: e.target.value }) }} />
                </div>
                <hr className="shareHr" />
                <form className="shareBottom" onSubmit={submitHandler}>
                    <button className="shareButton" type="Submit">Share</button>
                </form>
            </div>
        </div>
    )
}
