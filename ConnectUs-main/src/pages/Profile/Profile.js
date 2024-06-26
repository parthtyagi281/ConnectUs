import { useEffect } from "react"
import "./profile.css"
import Navbar from "../../components/Navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Feed from "../../components/feed/Feed"
import RightBar from "../../components/rightbar/RightBar"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function Profile() {
    const params = useParams();
    const [postUser, setPostUser] = useState(null);
    const pf = process.env.REACT_APP_PUBLLC_FOLDER;
    const username = params.username;
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPostUser = async () => {
            const url = `${process.env.REACT_APP_BASE_URL}api/user/get-user-by-id/${params.id}`
            let response = await axios.get(url)
            response = response.data;
            if (response.success === true) {
                setPostUser(response.user);
            }
        }
        if (!localStorage.getItem("auth-token")) {
            navigate("/login");
        }
        else {
            fetchPostUser();
        }
    }, [username])

    console.log(postUser,"profile");

    return postUser && (
        <div>
            <Navbar />
            <div className="profileContainer">
                <div className="hidden md:block w-[23%]">
                    <Sidebar />
                </div>
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileUserCover">
                            <img className="profileUserCoverImg" src={postUser.coverPicture ? pf + postUser.coverPicture : `${pf}cover.jpg`} alt="" />
                            <img src={postUser.profilePicture ? pf + postUser.profilePicture : `${pf}profile.jpg`} alt="" className="profileUserImg" />
                        </div>
                        <div className="profileUserInfo">
                            <h4 className="profileUserInfoName">{postUser.name}</h4>
                            <span className="profileUserInfoDesc">{postUser.desc}</span>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row">
                        <Feed profileId={params.id} right={true} />
                        <RightBar postUser={postUser} />
                    </div>
                </div>
            </div>
        </div>
    )
}
