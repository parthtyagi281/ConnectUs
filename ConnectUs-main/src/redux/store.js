import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import postReducer from "./post/postSlice";

const userPersistConfig = {
  key: "user",
  storage,
};

const postsPersistConfig = {
    key: "posts",
    storage,
  };
  

// Create persisted reducers
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedPostsReducer = persistReducer(postsPersistConfig, postReducer);

const Store = configureStore({
  reducer: {
    user: persistedUserReducer,
    post: persistedPostsReducer,
  },
});

const persistor = persistStore(Store);

export { Store, persistor };
