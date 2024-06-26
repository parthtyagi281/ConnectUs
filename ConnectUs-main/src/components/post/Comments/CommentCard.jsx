import "../post.css";
import { MoreVert, NavigateNextTwoTone } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import PostContext from "../../../Context/post/PostContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material";
import moment from "moment/moment";

export default function CommentCard({ comment }) {
  const timeAgo = moment(comment.createdAt).fromNow();
  const context = useContext(PostContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pf = process.env.REACT_APP_PUBLLC_FOLDER;
  const [displayPostEdit, setDisplayPostEdit] = useState(false);
  const currUser = useSelector((state) => state.user.user);

  const linkHandler = (e) => {
    e.preventDefault();
    navigate(`/profile/${comment.user._id}/${comment.user.name}`);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <div onClick={linkHandler}>
              <img
                className="postProfileImage"
                src={
                  comment.user.profilePicture
                    ? pf + comment.user.profilePicture
                    : `${pf}profile.jpg`
                }
                alt="Image"
              />
            </div>
            <span className="postProfileName">{comment.user.name}</span>
            <span className="postDate">{timeAgo}</span>
          </div>
        </div>
        <div className="postMid">
          <span className="postText">{comment.text ? comment.text : ""}</span>
        </div>
      </div>
    </div>
  );
}
