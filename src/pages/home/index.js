import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../../components/createPost";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/sendVerification";
import Stories from "../../components/home/stories";
import Post from "../../components/post";
import {
  getAllPosts,
  getNewCommentPost,
  getNewPost,
} from "../../redux/features/postSlice";
import "./style.css";
import PostSkeleton from "../../components/postSkeleton";

export default function Home({
  socketRef,
  setVisible,
  onlineUser,
  setPostShare,
  setIsProfile,
  setsharePostPopUp,
  toastDetailsPost,
}) {
  const { posts, loading, error } = useSelector((state) => ({
    ...state.newFeed,
  }));

  useEffect(() => {
    const handleNewComment = (data) => {
      dispatch(getNewCommentPost(data));
    };

    socketRef?.on("newComment", handleNewComment);

    return () => {
      socketRef?.off("newComment", handleNewComment);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleNewPost = (data) => {
      dispatch(getNewPost(data));
    };

    socketRef?.on("newPost", handleNewPost);

    return () => {
      socketRef?.off("newPost", handleNewPost);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { user } = useSelector((state) => ({ ...state.auth }));
  const userId = user?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts({ userToken: user.token }));
    // dispatch(getConversations({ userToken: user.token }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="background-secondary">
      <LeftHome user={user} />

      <RightHome onlineUser={onlineUser} />

      <div className="home">
        <div className="home_middle">
          <Stories user={user} />
          {user.verified === false && <SendVerification user={user} />}
          <CreatePost user={user} setVisible={setVisible} />
          {loading ? (
            <>
              <PostSkeleton style1 />
              <PostSkeleton style1 />
            </>
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
                  toastDetailsPost={toastDetailsPost}
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
