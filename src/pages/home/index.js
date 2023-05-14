import { useEffect } from "react";
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
import {
  getAllPosts,
  getNewCommentPost,
  getNewPost,
} from "../../redux/features/postSlice";
import "./style.css";

export default function Home({
  socketRef,
  setVisible,
  onlineUser,
  setOnlineUsers,
  setPostShare,
  setIsProfile,
  setsharePostPopUp,
}) {
  const { posts, loading, error } = useSelector((state) => ({
    ...state.newFeed,
  }));

  useEffect(() => {
    if (socketRef) {
      socketRef.on("newComment", (data) => {
        // console.log(data);
        dispatch(getNewCommentPost(data));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

  useEffect(() => {
    if (socketRef) {
      socketRef.on("newPost", (data) => {
        dispatch(getNewPost(data));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

  const { user } = useSelector((state) => ({ ...state.auth }));
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
        socketRef={socketRef}
        onlineUser={onlineUser}
        setOnlineUsers={setOnlineUsers}
      />
      <LeftHome user={user} />

      <RightHome onlineUser={onlineUser} />

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
                  post={post}
                  user={user}
                  key={post?._id}
                  socketRef={socketRef}
                  setIsProfile={setIsProfile}
                  setPostShare={setPostShare}
                  setsharePostPopUp={setsharePostPopUp}
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
