import { createSlice } from "@reduxjs/toolkit";


export const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        status: null,
        error: "",
        isLoading:false
    },
    reducers: {
        fetchPostsLoading: (state) => {
            state.isLoading = true;
        },
        fetchPostsSuccess: (state, { payload }) => {
            state.isLoading = false;
            payload.sort((x, y) => {
                return new Date(x.createdAt) < new Date(y.createdAt) ? 1 : -1
            })
            state.posts = payload;
        },
        fetchPostsFail: (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        }
    }
})



const { reducer, actions } = postSlice;

export const { fetchPostsLoading, fetchPostsSuccess, fetchPostsFail } = actions;

export default reducer;
