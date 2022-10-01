import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/sendVerification";
import Stories from "../../components/home/stories";
import Post from "../../components/post";
import "./style.css";

export default function Home({ setVisible, posts, loading, getAllPosts }) {
  const { user } = useSelector((state) => ({ ...state }));
  const middle = useRef(null);
  const [height, setHeight] = useState(0);
  const [onlineUser, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    setHeight(middle.current.clientHeight);
  }, [loading]);

  //Get conversation
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/chat/conversations`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, []);

  return (
    <div className="home" style={{ height: `${height + 250}px` }}>
      <Header
        page="home"
        getAllPosts={getAllPosts}
        onlineUser={onlineUser}
        setOnlineUsers={setOnlineUsers}
        conversations={conversations}
      />
      <LeftHome user={user} />
      <div className="home_middle" ref={middle}>
        <Stories user={user} />
        {user.verified === false && <SendVerification user={user} />}
        <CreatePost user={user} setVisible={setVisible} />
        {loading ? (
          <div className="sekelton_loader">
            <HashLoader color="#1876f2" />
          </div>
        ) : (
          <div className="posts">
            {posts.map((post, i) => (
              <Post key={i} post={post} user={user} />
            ))}
          </div>
        )}
      </div>
      <RightHome onlineUser={onlineUser} conversations={conversations} />
    </div>
  );
}
