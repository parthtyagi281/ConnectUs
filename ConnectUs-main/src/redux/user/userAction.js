import { fetchUserLoading, fetchUserSuccess, fetchUserFail } from "./userSlice";

export const getUser = () => async (dispatch) => {
  try {
    dispatch(fetchUserLoading());
    const url = `${process.env.REACT_APP_BASE_URL}api/user/get-user-by-token`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    });
    response = await response.json();
    console.log(response);
    if (response.success) {
      dispatch(fetchUserSuccess(response.user));
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = (savedUser) => async (dispatch) => {
  try {
    dispatch(fetchUserSuccess(savedUser));
  } catch (error) {
    console.log(error);
  }
};

export const followUser =
  ({ setfProgress, postUser }) =>
  async (dispatch, getState) => {
    try {
      setfProgress(true);
      const url = `${process.env.REACT_APP_BASE_URL}api/user/${postUser._id}/follow`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      response = await response.json();
      if (response.success === true) {
        const currentUser = getState().user.user;
        console.log("clicked");
        const updatedUser = {
          ...currentUser,
          following: [...currentUser.following, postUser],
        };
        dispatch(fetchUserSuccess(updatedUser));
      }
      setfProgress(false);
    } catch (error) {
      console.log(error);
    }
  };

export const unfollowUser =
  ({ setfProgress, postUser }) =>
  async (dispatch, getState) => {
    try {
      setfProgress(true);
      const url = `${process.env.REACT_APP_BASE_URL}api/user/${postUser._id}/unfollow`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      response = await response.json();
      if (response.success == true) {
        const currentUser = getState().user.user;
        const updatedUser = {
          ...currentUser,
          following: currentUser.following.filter(
            (obj) => obj._id !== postUser._id
          ),
        };
        dispatch(fetchUserSuccess(updatedUser));
      }
      setfProgress(false);
    } catch (error) {
      console.log(error);
    }
  };
