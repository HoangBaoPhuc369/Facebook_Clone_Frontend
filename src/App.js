import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import { useSelector } from "react-redux";
import Activate from "./pages/home/activate";
import Reset from "./pages/reset";
import CreatePostPopup from "./components/createPostPopup";
import { useState } from "react";
import Friends from "./pages/friends";
import DeletePostPopUp from "./components/deletePost";

function App() {
  const [visible, setVisible] = useState(false);
  const [onlineUser, setOnlineUsers] = useState([]);
  const [visibleDelPost, setVisibleDelPost] = useState(false);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { darkTheme } = useSelector((state) => ({ ...state.theme }));

  return (
    <div className={darkTheme ? "dark" : "light"}>
      {visible && <CreatePostPopup user={user} setVisible={setVisible} />}

      {visibleDelPost && <DeletePostPopUp />}

      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/profile"
            element={
              <Profile
                setVisible={setVisible}
                onlineUser={onlineUser}
                setOnlineUsers={setOnlineUsers}
              />
            }
            exact
          />
          <Route
            path="/profile/:username"
            element={
              <Profile
                setVisible={setVisible}
                onlineUser={onlineUser}
                setOnlineUsers={setOnlineUsers}
              />
            }
            exact
          />
          <Route path="/friends" element={<Friends />} exact />
          <Route path="/friends/:type" element={<Friends />} exact />
          <Route
            path="/"
            element={
              <Home
                onlineUser={onlineUser}
                setVisible={setVisible}
                setOnlineUsers={setOnlineUsers}
                setVisibleDelPost={setVisibleDelPost}
              />
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  );
}

export default App;
