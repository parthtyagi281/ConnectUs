import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "./post.css";
import { MoreVert, NavigateNextTwoTone } from "@mui/icons-material";

import { format } from "timeago.js";
import { useContext } from "react";
import PostContext from "../../../Context/post/PostContext";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Share from "./share/Share";
import CommentCard from "./CommentCard";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

export default function Comments({
  fullScreen,
  showComments,
  setShowComments,
  post,
}) {
  const context = useContext(PostContext);
  const [allComments, setAllComments] = useState(post.comments);
  const { deletePostFn } = context;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pf = process.env.REACT_APP_PUBLLC_FOLDER;
  const [postUser, setPostUser] = useState({});
  const [displayPostEdit, setDisplayPostEdit] = useState(false);
  const currUser = useSelector((state) => state.user.user);

  const fetchPostUser = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}api/user/get-user-by-id/${post.userId}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    if (response.success === true) {
      setPostUser(response.user);
    }
  };

  const postComment = async ({ comment, setDesc }) => {
    try {
      const url = `${process.env.REACT_APP_BASE_URL}api/user/post/comments/${post._id}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(comment),
      });

      response = await response.json();
      if (response.success) {
        setAllComments([response.comment, ...allComments]);
        setDesc({ desc: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchPostUser();
  }, []);

  useEffect(() => {}, [allComments]);

  const [isLike, setIsLike] = useState(post.likes.includes(currUser._id));
  const [like, setLike] = useState(post.likes.length);

  const likeHandler = async () => {
    isLike ? setLike(like - 1) : setLike(like + 1);
    setIsLike(!isLike);
    const url = `${process.env.REACT_APP_BASE_URL}api/user/post/${post._id}/like`;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    });
    response = await response.json();
  };

  const linkHandler = (e) => {
    e.preventDefault();
    navigate(`/profile/${postUser._id}/${postUser.name}`);
  };

  return (
    <React.Fragment>
      <Dialog
        
        maxWidth={"lg"}
        open={showComments}
        onClose={() => {
          setShowComments(false);
        }}
        aria-labelledby="responsive-dialog-title"
        className="md:mr-[150px] overflow-y-auto w-[100%]"
      >
        <div
          onClick={() => {
            setShowComments(false);
          }}
          className="flex justify-end mt-3 mr-3 cursor-pointer w-[70vw] mx-auto md:w-[70vw]"
        >
          <CloseIcon />
        </div>
        <DialogContent className="flex flex-col gap-[20px]">
          <div style={{ marginTop: "0px" }} className="post ">
            <div className="postWrapper ">
              <div className="postTop">
                <div className="postTopLeft">
                  <div onClick={linkHandler}>
                    <img
                      className="postProfileImage"
                      src={
                        postUser.profilePicture
                          ? pf + postUser.profilePicture
                          : `${pf}profile.jpg`
                      }
                      alt="Image"
                    />
                  </div>
                  <span className="postProfileName">{postUser.name}</span>
                  <span className="postDate">{format(post.createdAt)}</span>
                </div>
                <div className="postTopRight">
                  {postUser._id === currUser._id && (
                    <MoreVert
                      onClick={() => {
                        setDisplayPostEdit(!displayPostEdit);
                      }}
                      className="verticalDot"
                    />
                  )}
                  {displayPostEdit && (
                    <div className="postEditContainer">
                      <div className="postEdit">
                        <div
                          className="postEditItem"
                          onClick={() => {
                            deletePostFn(post._id);
                          }}
                        >
                          Delete Post
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="postMid">
                <span className="postText">{post.desc ? post.desc : ""}</span>
                {post.img && (
                  <img
                    src={pf + post.img}
                    alt="Post Image"
                    className="postImage"
                  />
                )}
              </div>
              <div className="postBottom">
                <div className="postBottomLeft">
                  <img
                    className="postLikeIcon"
                    src="/assets/heart.png"
                    onClick={likeHandler}
                    alt=""
                  />
                  <img
                    className="postLikeIcon"
                    src="/assets/like.png"
                    onClick={likeHandler}
                    alt=""
                  />
                  <span className="postLikeCounter">{like} Likes </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Share postComment={postComment} postId={post._id} />
          </div>
          {allComments.length > 0 ? (
            <div className="flex flex-col gap-3">
              <h3 className="pl-2">All Comments</h3>
              {allComments.map((comment, index) => {
                return <CommentCard comment={comment} key={index} />;
              })}
            </div>
          ) : (
            <h3 className="pl-2">No comments yet</h3>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
