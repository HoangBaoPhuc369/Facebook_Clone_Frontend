import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNewCommentPost,
  handleAddUserTypingPost,
  handleRemoveUserTypingPost,
} from "../../redux/features/postSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearPostDetails,
  getNewCommentPostDetail,
  getPost,
} from "../../redux/features/notificationSlice";
import PostPopUp from "../post/PostPopUp";
import PostSkeleton from "../postSkeleton";

export default function DetailsNotifications({ socketRef, toastDetailsPost }) {
  const { type } = useParams();
  const { notificationsSelected, loadingPostDetails, postDetails } =
    useSelector((state) => ({
      ...state.notification,
    }));
  const { user } = useSelector((state) => ({ ...state.auth }));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (type === "post") {
      dispatch(
        getPost({
          userToken: user.token,
          postId: notificationsSelected?.postId,
        })
      );
    } else if (type === "system") {
      dispatch(clearPostDetails());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, notificationsSelected]);

  useEffect(() => {
    const handleNewComment = (data) => {
      dispatch(getNewCommentPostDetail(data));
    };

    socketRef?.on("newComment", handleNewComment);

    return () => {
      socketRef?.off("newComment", handleNewComment);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

  return (
    <div className="background-secondary">
      <div className="home">
        <div
          className="home_middle w-full flex flex-col flex-wrap content-center"
          style={{
            marginTop: postDetails || loadingPostDetails ? "75px" : "0",
          }}
        >
          {loadingPostDetails ? (
            <div>
              <PostSkeleton />
            </div>
          ) : postDetails ? (
            <PostPopUp
              details
              user={user}
              post={postDetails}
              socketRef={socketRef}
              toastDetailsPost={toastDetailsPost}
            />
          ) : !postDetails && type === "post" ? (
            <div
              className="w-full h-full flex items-center justify-center 
          details-post-text-content"
            >
              <div className="w-[500px] text-center">
                <div className="w-full flex justify-center">
                  <img
                    className="h-[112px] w-[112px]"
                    src="../../icons/lock-icon8.svg"
                    alt="lock"
                  />
                </div>
                <div className="">
                  <p className="text-[20px] font-bold">
                    This content isn't available right now
                  </p>
                  <p className="text-[17px]">
                    When this happens, it's usually because the owner only
                    shared with a small group of people, changed who can see it
                    or it's been deleted.
                  </p>
                </div>
                <button
                  onClick={() => {
                    // dispatch(setPage("home"));
                    navigate("/");
                  }}
                  className="bg-blue-600 h-10 px-10 rounded-md mt-4 text-white details-post-btn"
                >
                  Go to News Feed
                </button>
              </div>
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center 
        details-post-text-content"
            >
              <div className="w-[500px] text-center">
                <div className="w-full flex justify-center">
                  <img
                    className="h-[112px] w-[112px]"
                    src="../../icons/AI_icon.png"
                    alt="lock"
                  />
                </div>
                <div className="">
                  <p className="text-[20px] font-bold">
                    Warning: Your Content Contains Toxic Elements and has been
                    Hidden
                  </p>
                  <p className="text-[17px]">
                    Our AI model have detected and hidden your content as it
                    contains harmful elements, your content contains the
                    following toxic labels:{" "}
                    <span className="text-blue-500">
                      {notificationsSelected.hateSpeechLabels.join(", ")}
                    </span>
                    .
                  </p>
                </div>
                <button
                  onClick={() => {
                    // dispatch(setPage("home"));
                    navigate("/");
                  }}
                  className="bg-blue-600 h-10 px-10 rounded-md mt-4 text-white details-post-btn"
                >
                  Go to News Feed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
