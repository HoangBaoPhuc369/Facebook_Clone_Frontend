import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header";
import { getNewCommentPost } from "../../redux/features/postSlice";
import { useParams } from "react-router-dom";
import { getPost } from "../../redux/features/notificationSlice";
import PostPopUp from "../post/PostPopUp";

export default function DetailsNotifications({
  socketRef,
  onlineUser,
  setOnlineUsers,
}) {
  const { type } = useParams();
  const { notificationsSelected, loadingPostDetails, postDetails } =
    useSelector((state) => ({
      ...state.notification,
    }));
  const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();

  console.log(notificationsSelected);

  useEffect(() => {
    if (type === "post") {
      dispatch(
        getPost({
          userToken: user.token,
          postId: notificationsSelected?.postId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (socketRef) {
      socketRef.on("newComment", (data) => {
        dispatch(getNewCommentPost(data));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

  return (
    <div className="background-secondary">
      <Header
        page="home"
        socketRef={socketRef}
        onlineUser={onlineUser}
        setOnlineUsers={setOnlineUsers}
      />
      {loadingPostDetails ? (
        <div className="">Loading</div>
      ) : postDetails ? (
        <div className="home">
          <div className="home_middle w-full flex flex-col flex-wrap content-center">
            <PostPopUp
              details
              user={user}
              post={postDetails}
              socketRef={socketRef}
            />
          </div>
        </div>
      ) : (
        "Don't have details"
      )}
    </div>
  );
}
