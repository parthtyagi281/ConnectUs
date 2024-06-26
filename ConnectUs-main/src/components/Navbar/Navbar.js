import "./navbar.css";
import {
  Search,
  Person,
  Notifications,
  Chat,
  Cancel,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import PostContext from "../../Context/post/PostContext";

export default function Navbar() {
  const context = useContext(PostContext);
  const { logoutSuccess } = context;
  const [modal, setModal] = useState(false);
  const pf = process.env.REACT_APP_PUBLLC_FOLDER;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchcred, setSearchcred] = useState("");
  const user = useSelector((state) => state.user.user);
  const [searchResult, setSearchResult] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const logOutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    navigate("/login");
    logoutSuccess();
  };

  const onchange = async (e) => {
    setSearchcred(e.target.value);
    if (searchcred.trim() !== "") {
      const url = `${process.env.REACT_APP_BASE_URL}api/user/search-user/${e.target.value}`;
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      response = await response.json();
      if (response.success === true) {
        setShowSearch(true);
        setSearchResult(response.users);
      }
    }
  };


  return (
    <div className="navbarContainer flex w-[100%] py-[10px] ">
      <div className="w-[32%] sm:w-[26%]">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo md:pl-[20px] text-[20px] md:text-[24px]">
            ConnectUs
          </span>
        </Link>
      </div>
      <div className="relative w-[40%] sm:w-[40%]">
        <div className="searchbar flex gap-[10px] justify-center items-center">
          <Search className="searchIcon" />
          <input
            placeholder="Search friends, posts, video..."
            className="searchInput text-[15px] w-[63%] sm:w-[80%]"
            value={searchcred}
            onChange={onchange}
          />
        </div>
        {(searchResult.length > 0 &&showSearch) &&(
          <div className="search-results">
            <div className="search-result">
              {searchResult.length > 0 ? (
                searchResult.map((s) => {
                  return (
                    <Link
                      key={s._id}
                      onClick={() => {
                        setShowSearch(false);
                      }}
                      className="searchUserInfo"
                      to={`/profile/${s._id}/${s.name}`}
                    >
                      <img
                        className="searchUserImage"
                        src={
                          s.profilePicture
                            ? pf + s.profilePicture
                            : `${pf}profile.jpg`
                        }
                        alt="Img"
                      />
                      <span>{s.name}</span>
                    </Link>
                  );
                })
              ) : (
                <div className="searchUserInfo">
                  <span>No User Found!</span>
                </div>
              )}
              <div
                className="cancelIcon"
                onClick={() => {
                  setShowSearch(false);
                  setSearchcred("");
                }}
              >
                <Cancel />
              </div>
            </div>
          </div>
        )}
        {(searchResult.length == 0 &&showSearch) &&(
          <div className="search-results">
            <div className="search-result">
              {searchResult.length > 0 ? (
                searchResult.map((s) => {
                  return (
                    <Link
                      key={s._id}
                      onClick={() => {
                        setShowSearch(false);
                      }}
                      className="searchUserInfo"
                      to={`/profile/${s._id}/${s.name}`}
                    >
                      <img
                        className="searchUserImage"
                        src={
                          s.profilePicture
                            ? pf + s.profilePicture
                            : `${pf}profile.jpg`
                        }
                        alt="Img"
                      />
                      <span>{s.name}</span>
                    </Link>
                  );
                })
              ) : (
                <div className="searchUserInfo">
                  <span>No User Found!</span>
                </div>
              )}
              <div
                className="cancelIcon"
                onClick={() => {
                  setShowSearch(false);
                  setSearchcred("");
                }}
              >
                <Cancel />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-[28%] sm:w-[34%] relative flex justify-end gap-[20px] pr-[20px]  items-center">
        <div className="navbarLinks">
          <span
            className="navbarLink hidden min-[990px]:block"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            HomePage
          </span>
        </div>
        <div className="hidden md:flex">
          <div className="navbarIconsItem">
            <Person />
            <span className="navbarIconsBedge">1</span>
          </div>
          <div className="navbarIconsItem">
            <Chat />
            <span className="navbarIconsBedge">1</span>
          </div>
          <div className="navbarIconsItem">
            <Notifications />
            <span className="navbarIconsBedge">1</span>
          </div>
        </div>
        <img
          onClick={() => {
            setModal(!modal);
          }}
          src={
            user.profilePicture ? pf + user.profilePicture : `${pf}profile.jpg`
          }
          alt="Person"
          className="navbarImg"
        />

        <div className="navbarModalContainer ">
          {modal && (
            <div className="navbarModal rounded-md">
              <Link
                style={{ textDecoration: "none" }}
                onClick={() => {
                  setModal(false);
                }}
                className="navbarModalItem text-center"
                to={`/profile/${user._id}/${user.name}`}
              >
                Profile
              </Link>
              <Link
                className="navbarModalItem text-center"
                onClick={() => {
                  setModal(false);
                }}
                style={{ textDecoration: "none" }}
                to={`/${user._id}/${user.name}/update-profile`}
              >
                Update Profile
              </Link>
              <Link
                className="navbarModalItem text-center"
                onClick={() => {
                  setModal(false);
                }}
                style={{ textDecoration: "none" }}
                to={`/messanger`}
              >
                Chats
              </Link>
              <div
                className="navbarModalItem text-center"
                onClick={logOutHandler}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
