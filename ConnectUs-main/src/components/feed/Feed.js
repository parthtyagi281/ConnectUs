import React from "react";
import "./Feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { getPosts } from "../../redux/post/postAction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux/es/exports";
import { useEffect } from "react";
import { specificUserPosts } from "../../redux/post/postAction";

export default function Feed(props) {
  const user = useSelector((state) => state.user.user);
  const postCreated = () => {
    !props.profileId
      ? dispatch(getPosts())
      : dispatch(specificUserPosts(props.profileId));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    !props.profileId
      ? dispatch(getPosts())
      : dispatch(specificUserPosts(props.profileId));
  }, [props.profileId]);

  const Posts = useSelector((state) => state.post.posts);
  let flag = false;

  return (
    <div className="feedContainer">
      {props.right ? (
        <div
          className=" px-[20px] pt-[10px]"
          style={{ color: "gray", fontSize: "24px", fontWeight: "500" }}
        >
          User posts
        </div>
      ) : (
        ""
      )}
      <div className="feedWrapper">
        {!props.right && <Share postCreated={postCreated} />}
        {Posts.length !== 0 ? (
          Posts.map((post) => {
            if (props.right === false) {
              return <Post key={post._id} post={post} />;
            } else {
              if (post.userId === props.profileId) {
                flag = true;
                return <Post key={post._id} post={post} />;
              }
            }
          })
        ) : (
          <div
            className="py-[10px]"
            style={{ color: "gray", fontSize: "24px", fontWeight: "500" }}
          >
            {!props.right && "No Posts!"}
          </div>
        )}
        {props.right && flag === false ? (
          <div
            className="py-[10px]"
            style={{ color: "gray", fontSize: "24px", fontWeight: "500" }}
          >
            No user personal posts!
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
