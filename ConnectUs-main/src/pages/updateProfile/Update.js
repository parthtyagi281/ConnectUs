import "./update.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import PostContext from "../../Context/post/PostContext";
import { CircularProgress } from "@mui/material";
import { updateUser } from "../../redux/user/userAction";
import { useDispatch } from "react-redux";

export default function Update() {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(false);
  const context = useContext(PostContext);
  const { ServerError, profileUpdated } = context;
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const params = useParams();
  const [profileCred, setProfileCred] = useState({
    name: "",
    email: "",
    desc: "",
    city: "",
    from: "",
    relationship: "",
    profilePicture: "",
    coverPicture: "",
  });
  const [render, setRender] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      setRender(true);
    } else {
      navigate("/login");
    }
  });

  const onChangeInput = (event) => {
    setProfileCred({ ...profileCred, [event.target.name]: event.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const profileData = { ...profileCred };
    if (profileFile) {
      const data = new FormData();
      const filename = Date.now() + profileFile.name;
      data.append("name", filename);
      data.append("file", profileFile);
      profileData["profilePicture"] = filename;
      try {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}api/upload-profilePicture`,
          data
        );
        setProfileFile(null);
      } catch (error) {
        console.log(error);
      }
    }

    if (coverFile) {
      const data = new FormData();
      const filename = Date.now() + coverFile.name;
      data.append("name", filename);
      data.append("file", coverFile);
      profileData["coverPicture"] = filename;
      try {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}api/upload-coverPicture`,
          data
        );
        setCoverFile(null);
      } catch (error) {
        console.log(error);
      }
    }

    // here we are deleting the those key which are empty because other wise these key value will be replace with blank space
    for (let key in profileData) {
      if (profileData[key] === "") {
        delete profileData[key];
      }
    }
    setProgress(true);
    const url = `${process.env.REACT_APP_BASE_URL}api/user/update/${params.id}`;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify(profileData),
    });
    response = await response.json();
    if (response.success === true) {
      profileUpdated();
      navigate("/");
      console.log(response);
      dispatch(updateUser(response.user));
    } else {
      ServerError();
    }
    setProgress(false);
  };

  return (
    render && (
      <div className="bg-[#e1f4fa] min-w-[100vw] min-h-[100vh] flex justify-center items-center">
        <div className="flex flex-col sm:flex-row">
          <div className="left flex flex-col justify-center max-[641px]:items-center sm:pl-[20px] w-[100%] sm:w-[50%]">
            <h4 className="updateLogo text-[36px] sm:text-[55px] font-medium">
              ConnectUs
            </h4>
            <div className="text-[15px] sm:text-[24px] max-[641px]:text-center font-medium w-[90%] sm:w-[70%]">
              Connect with friends and the world around you on ConnectUs.
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mt-[20px] w-[100%] sm:w-[50%] ">
            <h4 className="updateTitle">Update Your Profile</h4>
            <form
              className="gap-[10px] flex flex-col p-[20px] bg-white rounded-[10px] w-[90%] mb-[15px]"
              onSubmit={submitHandler}
            >
              <div className="updateBoxItem">
                <label htmlFor="name">Name:</label>
                <input
                  value={profileCred.name}
                  onChange={onChangeInput}
                  autoComplete="on"
                  className="updateInput"
                  type="text"
                  placeholder="Username"
                  name="name"
                  id="name"
                />
              </div>
              <div className="updateBoxItem">
                <label htmlFor="email">Email:</label>
                <input
                  value={profileCred.email}
                  onChange={onChangeInput}
                  autoComplete="on"
                  className="updateInput"
                  type="email"
                  placeholder="Email"
                  name="email"
                  id="email"
                />
              </div>
              <div className="updateBoxItem">
                <label htmlFor="desc">Description for ConnectUs profile:</label>
                <input
                  value={profileCred.desc}
                  onChange={onChangeInput}
                  autoComplete="on"
                  className="updateInput"
                  type="text"
                  placeholder="Description"
                  name="desc"
                  id="desc"
                />
              </div>
              <div className="updateBoxItem">
                <label htmlFor="city">City:</label>
                <input
                  value={profileCred.city}
                  onChange={onChangeInput}
                  autoComplete="on"
                  className="updateInput"
                  type="text"
                  placeholder="City"
                  name="city"
                  id="city"
                />
              </div>
              <div className="updateBoxItem">
                <label htmlFor="from">Country:</label>
                <input
                  value={profileCred.from}
                  onChange={onChangeInput}
                  autoComplete="on"
                  className="updateInput"
                  type="text"
                  placeholder="Country"
                  name="from"
                  id="from"
                />
              </div>
              <div className="updateBoxItem">
                <label htmlFor="relationship">Relationship:</label>
                <select
                  onChange={onChangeInput}
                  style={{ cursor: "pointer" }}
                  className="updateInput"
                  name="relationship"
                  id="relationship"
                >
                  <option value="Married" selected={true}>
                    Select
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>
              <div>
                <label
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  htmlFor="profilePicture"
                >
                  Profile Picture:
                </label>
                <input
                  style={{ marginTop: "5px", cursor: "pointer" }}
                  autoComplete="on"
                  id="profilePicture"
                  type="file"
                  name="profilePicture"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => {
                    setProfileFile(e.target.files[0]);
                  }}
                />
              </div>
              <div>
                <label
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  htmlFor="coverPicture"
                >
                  Cover Picture:
                </label>
                <input
                  style={{ marginTop: "5px", cursor: "pointer" }}
                  autoComplete="on"
                  id="coverPicture"
                  type="file"
                  name="coverPicture"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => {
                    setCoverFile(e.target.files[0]);
                  }}
                />
              </div>
              <button className="updateButton" type="Submit">
                {progress ? (
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
                  "Update"
                )}
              </button>
              <button
                className="updateButton"
                type="button"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
