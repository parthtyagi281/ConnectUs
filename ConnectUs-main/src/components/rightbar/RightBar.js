import "./RightBar.css";
import Online from "../online/Online";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Add, Remove, Chat, DriveFileMove } from "@mui/icons-material";
import { unfollowUser } from "../../redux/user/userAction";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import PostContext from "../../Context/post/PostContext";
import { CircularProgress } from "@mui/material";
import { followUser } from "../../redux/user/userAction";

const RightBar = (props) => {
  const [cprogress, setcProgress] = useState(false);
  const [fprogress, setfProgress] = useState(false);
  const context = useContext(PostContext);
  const { of } = context;
  const [onlineFriends, setOnlineFriends] = useState(of);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const postUser = props.postUser;
  const pf = process.env.REACT_APP_PUBLLC_FOLDER;
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState([]);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    setIsFriend(false);
    if (postUser) {
      for (let i = 0; i < user.following.length; i++) {
        if (user.following[i]._id === postUser._id) {
          setIsFriend(true);
          break;
        }
      }
    }
  }, [postUser]);

  useEffect(() => {
    setOnlineFriends(of);
  }, [of.length]);

  const fetchFriends = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}api/user/friends/${postUser._id}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    if (response.success === true) {
      setFriendList(response.friendlist);
    }
  };

  const unfollowHandler = async (e) => {
    setIsFriend(false);
    e.preventDefault();
    dispatch(unfollowUser({ setfProgress, postUser }));
  };

  const followHandler = async (e) => {
    setIsFriend(true);
    e.preventDefault();
    dispatch(followUser({ setfProgress, postUser }));
  };

  const messageClickHandler = async (e) => {
    e.preventDefault();
    setcProgress(true);
    const data = {
      recieverId: `${postUser._id}`,
      senderId: `${user._id}`,
    };
    const url = `${process.env.REACT_APP_BASE_URL}api/conversation`;
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify(data),
    });
    response = await response.json();
    if (response.success === true) {
      navigate("/messanger");
    }
    setcProgress(false);
  };

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      postUser && fetchFriends();
    } else {
      navigate("/login");
    }
  }, [postUser, Object.keys(user).length]);

  const ProfileRightBar = () => {
    return (
      Object.keys(user).length !== 0 && (
        <div className="rightbarWrapper ">
          {postUser._id !== user._id &&
            (isFriend ? (
              <div className="rightbarButtons">
                <button
                  className="rightbarFollowButton"
                  onClick={unfollowHandler}
                >
                  <span className="rightbarFollowButtonText">
                    {fprogress ? (
                      <div
                        style={{
                          height: "80%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CircularProgress style={{ color: "white" }} />
                      </div>
                    ) : (
                      "Unfollow"
                    )}
                  </span>
                </button>
                <button className="rightbarFollowButton">
                  <span
                    className="rightbarFollowButtonText"
                    onClick={messageClickHandler}
                  >
                    {cprogress ? (
                      <div
                        style={{
                          height: "80%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CircularProgress style={{ color: "white" }} />
                      </div>
                    ) : (
                      "Chat"
                    )}
                  </span>
                  <Chat style={{ marginLeft: "5px" }} />
                </button>
              </div>
            ) : (
              <button className="rightbarFollowButton" onClick={followHandler}>
                <span className="rightbarFollowButtonText">
                  {fprogress ? (
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress style={{ color: "white" }} />
                    </div>
                  ) : (
                    "Follow"
                  )}
                </span>
                <Add />
              </button>
            ))}
          <h4 className="rightbarTitle">User Information</h4>
          <div className="grid grid-cols-3 gap-[10px]">
            <span className="rightbarInfoKey">City</span>
            <span className="rightbarInfoKey ml-[20px]">:</span>
            <span className="rightbarInfoValue">
              {postUser.city || "City is not added"}
            </span>

            <span className="rightbarInfoKey">From(Country)</span>
            <span className="rightbarInfoKey ml-[20px]">:</span>
            <span className="rightbarInfoValue">
              {postUser.from || "Country is not added"}
            </span>

            <span className="rightbarInfoKey">Relationship</span>
            <span className="rightbarInfoKey ml-[20px]">:</span>
            <span className="rightbarInfoValue">
              {postUser.relationship || "Relationship information is not added"}
            </span>
          </div>

          <h4 className="rightbarTitle">Friends</h4>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {friendList.length !== 0 ? (
              friendList.map((friend) => {
                return (
                  <div
                    key={friend._id}
                    className="rightbarFollowings"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/profile/${friend._id}/${friend.name}`);
                    }}
                  >
                    <div className="rightbarFollowing">
                      <img
                        className="rightbarFollowingImg"
                        src={
                          friend.profilePicture
                            ? pf + friend.profilePicture
                            : `${pf}profile.jpg`
                        }
                        alt=""
                      />
                      <span className="rightbarFollowingName">
                        {friend.name}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{ color: "gray", fontSize: "20px", fontWeight: "500" }}
              >
                No Friends yet!
              </div>
            )}
          </div>
        </div>
      )
    );
  };

  const HomeRightBar = () => {
    return (
      <div className="rightbarWrapper ">
        <div className="birthdayContainer">
          <img className="birthdayGift" src="/assets/gift.png" alt="giftCard" />
          <span className="birthdayText">
            <b>Pushpendra</b> and <b>other 2 friends</b> have birthday today.
          </span>
        </div>
        <img className="rightbarAd" src={`${pf}ad.jpg`} alt="Advertisement" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="onlineFriendsList">
          {onlineFriends.map((u) => {
            return <Online key={u._id} user={u} />;
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="rightbarContainer md:sticky md:top-[50px]">
      {postUser ? <ProfileRightBar /> : <HomeRightBar />}
    </div>
  );
};

export default RightBar;
