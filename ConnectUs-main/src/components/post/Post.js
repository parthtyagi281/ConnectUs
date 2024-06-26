import "./post.css"
import { MoreVert, NavigateNextTwoTone } from "@mui/icons-material"
import { useState } from "react";
import { useEffect } from "react";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { useContext } from "react";
import PostContext from "../../Context/post/PostContext";
import Comments from "./Comments/Comments";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material";

export default function Post(props) {
    const context = useContext(PostContext)
    const { deletePostFn } = context;
    const navigate = useNavigate();
    const pf = process.env.REACT_APP_PUBLLC_FOLDER;
    const { post } = props;
    const [postUser, setPostUser] = useState({});
    const [displayPostEdit, setDisplayPostEdit] = useState(false);
    const currUser = useSelector(state => state.user.user);
    const [showComments, setShowComments] = useState(false);
   

    const fetchPostUser = async () => {
        const url = `${process.env.REACT_APP_BASE_URL}api/user/get-user-by-id/${props.post.userId}`
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
            },
        })
        response = await response.json();
        if (response.success === true) {
            setPostUser(response.user);
        }
    }



    useEffect(() => {
        fetchPostUser();
    }, [])

   

    const [isLike, setIsLike] = useState(post.likes.includes(currUser._id));
    const [like, setLike] = useState(post.likes.length)


    const likeHandler = async () => {
        isLike ? setLike(like - 1) : setLike(like + 1);
        setIsLike(!isLike);
        const url = `${process.env.REACT_APP_BASE_URL}api/user/post/${post._id}/like`;
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': "application/json",
                'auth-token': localStorage.getItem("auth-token"),
            },
        })
        response = await response.json();
    }

    const linkHandler = (e) => {
        e.preventDefault();
        navigate(`/profile/${postUser._id}/${postUser.name}`);
    }

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <div onClick={linkHandler}>
                            <img className="postProfileImage" src={postUser.profilePicture ? pf + postUser.profilePicture : `${pf}profile.jpg`} alt="Image" />
                        </div>
                        <span className="postProfileName">{postUser.name}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        {postUser._id === currUser._id && <MoreVert onClick={() => { setDisplayPostEdit(!displayPostEdit) }} className="verticalDot" />}
                        {
                            displayPostEdit && <div className="postEditContainer">
                                <div className="postEdit">
                                    <div className="postEditItem" onClick={() => { deletePostFn(post._id) }}>Delete Post</div>
                                    {/* <div className="postEditItem">Edit Post</div> */}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="postMid">
                    <span className="postText">{post.desc ? post.desc : ""}</span>
                    {
                        post.img && <img src={pf + post.img} alt="Post Image" className="postImage" />
                    }
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="postLikeIcon" src="/assets/heart.png" onClick={likeHandler} alt="" />
                        <img className="postLikeIcon" src="/assets/like.png" onClick={likeHandler} alt="" />
                        <span className="postLikeCounter">{like} Likes </span>
                    </div>
                    <div onClick={() => { setShowComments(true);  }}  className="postBottomRight">
                        <span className="postCommentCounter">{post.comment} Comments</span>
                    </div>
                </div>
            </div>
            <Comments  post={post} fullScreen={fullScreen} showComments={showComments} setShowComments={setShowComments} />
        </div>
    )
}
