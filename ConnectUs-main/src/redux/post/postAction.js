import {
  fetchPostsLoading,
  fetchPostsSuccess,
  fetchPostsFail,
} from "./postSlice";

export const getPosts = () => async (dispatch, getState) => {
  dispatch(fetchPostsLoading, true);
  const url = `${process.env.REACT_APP_BASE_URL}api/user/post/timeline/all`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("auth-token"),
    },
  });
  response = await response.json();
  dispatch(fetchPostsSuccess(response.posts));
};

export const specificUserPosts = (id) => async (dispatch, getState) => {
  const url = `${process.env.REACT_APP_BASE_URL}api/user/post/profile/${id}`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("auth-token"),
    },
  });
  response = await response.json();
  dispatch(fetchPostsSuccess(response.posts));
};

export const addPost = (newPost) => async (dispatch,getState) => {
  try {
    const {post} = getState();
    const postsCopy=[...post.posts,newPost];
    dispatch(fetchPostsSuccess(postsCopy));
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch, getState) => {
  const currentPosts = getState().post.posts;
  const updatedPosts = currentPosts.filter((post) => {
    return post._id !== id;
  });
  dispatch(fetchPostsSuccess(updatedPosts));
};
