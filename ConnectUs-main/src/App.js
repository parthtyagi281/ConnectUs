import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Reset from "./pages/resetPassword/Reset";
import Update from "./pages/updateProfile/Update";
import Messanger from "./pages/Messanger/Messanger";
import PostState from "./Context/post/PostState";
import UserState from "./Context/user/UserState";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Reset2 from "./pages/resetPassword/Reset2";
import Confirmation_page from "./pages/resetPassword/Confirmation_page";
import SetPassword from "./pages/setPassword/setPassword.js";
import { Toaster } from "react-hot-toast";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {

  return (
    <UserState>
      <PostState>
        <Toaster/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route exact path="/profile/:id/:username" element={<Profile />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/reset-password/:token" element={<Reset />} />
            <Route exact path="/:id/:username/update-profile" element={<Update />} />
            <Route exact path="/messanger" element={<Messanger />} />
            <Route exact path="/reset-password" element={<Reset2 />} />
            <Route exact path="/Confirmation_page/:email" element={<Confirmation_page />} />
            <Route exact path="/setPassword/:token" element={<SetPassword />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </PostState>
    </UserState>
  );
}


export default App;
