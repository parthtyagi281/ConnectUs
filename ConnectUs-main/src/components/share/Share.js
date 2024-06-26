import "./share.css"
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@mui/icons-material"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/exports";
import { useState } from "react";
import { Link } from "react-router-dom";
import { addPost } from "../../redux/post/postAction";
import toast from "react-hot-toast";

import axios from "axios";

export default function Share(props) {
    const pf = process.env.REACT_APP_PUBLLC_FOLDER;
    const [currPosts, setCurrPosts] = useState(useSelector(state => state.post.posts))

    const [desc, setDesc] = useState({ desc: "" });

    const [file, setFile] = useState(null);

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
        const newPost = {
            desc: desc.desc,
            userId: user._id
        }

        if (file) {
            let data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            newPost.img = filename;
            try {
                await axios.post(`${process.env.REACT_APP_BASE_URL}api/upload`, data)
                setFile(null);

            } catch (error) {
                console.log(error);
            }
        }

        if (desc.desc === "" && !file) {
            console.log("there is nothing to post\n");
        }

        else {
            const toastID=toast.loading("Sharing...");
            const url = `${process.env.REACT_APP_BASE_URL}api/user/post`;
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'auth-token': localStorage.getItem("auth-token"),
                },
                body: JSON.stringify(newPost)
            })
            response = await response.json();
            if (response.success === true) {
                setDesc({ desc: "" });
                props.postCreated();
                dispatch(addPost(response.post));
                toast.dismiss(toastID);
                toast.success("Shared Successfully");
            }
            else
            {
                toast.dismiss(toastID);
                toast.error("Some error occurred");
            }
        }

    }

    return (
        <div className="shareContainer">
            <div className="shareWrapper">
                <div className="shareTop">
                    <Link to={`/profile/${user._id}/${user.name}`}>
                        <img src={user.profilePicture ? pf + user.profilePicture : `${pf}profile.jpg`} alt="Image" className="shareImageIcon" />
                    </Link>
                    <input name="desc" value={desc.desc} placeholder={`What are you thinking ${user.name}?`} className="shareInput" onChange={(e) => { setDesc({ ...desc, [e.target.name]: e.target.value }) }} />
                </div>
                <hr className="shareHr" />
                {
                    file && <div className="shareImageContainer">
                        <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                        <Cancel className="shareImgCancel" onClick={() => { setFile(null) }} />
                    </div>
                }
                <form className=" flex justify-between items-center mt-2" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="orange" className="shareOptionIcon" />
                            <span className="shareOptionText">Photo</span>
                            <input style={{ display: "none" }} type="file" id="file" name="file" accept=".png,.jpeg,.jpg" onChange={(e) => { setFile(e.target.files[0]) }} />
                        </label>
                    </div>
                    <button className="shareButton" type="Submit">Share</button>
                </form>
            </div>
        </div>
    )
}
