import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/sendVerification";
import Stories from "../../components/home/stories";
import Post from "../../components/post";
import { getConversations } from "../../redux/features/conversationSlice";
import { getAllPosts } from "../../redux/features/postSlice";
import "./style.css";

export default function Home({
  setVisible,
  onlineUser,
  conversations,
  setOnlineUsers,
  setVisibleDelPost,
}) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { posts, loading, error } = useSelector((state) => ({
    ...state.newFeed,
  }));

  const userId = user?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts({ userToken: user.token }));
    dispatch(getConversations({ userToken: user.token }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="background-secondary">
      <Header
        page="home"
        // getAllPosts={getAllPosts}
        onlineUser={onlineUser}
        setOnlineUsers={setOnlineUsers}
        conversations={conversations}
      />
      <LeftHome user={user} />

      <RightHome onlineUser={onlineUser} conversations={conversations} />

      <div className="home">
        <div className="home_middle">
          <Stories user={user} />
          {user.verified === false && <SendVerification user={user} />}
          <CreatePost user={user} setVisible={setVisible} />
          {loading ? (
            <div className="skeleton_loader">
              <HashLoader color="#1876f2" />
            </div>
          ) : (
            <div className="posts">
              {posts.map((post, i) => (
                <Post
                  key={post?._id}
                  post={post}
                  user={user}
                  setVisibleDelPost={setVisibleDelPost}
                />
              ))}
            </div>
          )}

          {error && <span>Something went wrong, {error}</span>}
        </div>
      </div>
    </div>
  );
}
