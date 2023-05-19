import { Link } from "react-router-dom";
import "./style.css";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useEffect, useState } from "react";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import { getReacts, reactPost } from "../../functions/post";
import Comment from "./Comment";
import DeletePostPopUp from "../deletePost";
import {
  createNotifications,
  viewNegativeCommentInPostDetails,
  viewNegativePostDetails,
} from "../../redux/features/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { formatTimeOrPost } from "../../functions/formatTime";
import {
  viewNegativeCommentInProfile,
  viewNegativePostInProfile,
} from "../../redux/features/profileSlice";
import ModalCustom from "../Modal";
import {
  viewNegativeCommentInPost,
  viewNegativePost,
} from "../../redux/features/postSlice";
import ThreeDotLoaderFlashing from "../threeDotLoader";
import useTypingComment from "../../hooks/useTypingComment";
import { FaUserFriends } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi";
import PostShare from "./PostShare";
import CreatePostSharePopup from "../createPostSharePopup";

export default function PostPopUp({
  user,
  post,
  profile,
  details,
  socketRef,
  onClose,
  toastDetailsPost,
}) {
  const { userTypingPosts } = useSelector((state) => state.newFeed);
  const { notificationsSelected } = useSelector((state) => ({
    ...state.notification,
  }));

  const isPostHaveTyping = userTypingPosts.some((p) => p === post?._id);

  const [showMenu, setShowMenu] = useState(false);
  const [reacts, setReacts] = useState();
  const [check, setCheck] = useState();
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(1);
  const [checkSaved, setCheckSaved] = useState();

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUnhideComment, setIsOpenUnhideComment] = useState(false);
  const [isOpenNegativePost, setIsOpenNegativePost] = useState(false);
  const [countReplies, setCountReplies] = useState(0);
  const [countRepliesThird, setCountRepliesThird] = useState(0);
  const [activeComment, setActiveComment] = useState(null);
  const [activeOptions, setActiveOptions] = useState(null);
  const [openSharePost, setOpenSharePost] = useState(false);

  const [selected, setSelected] = useState(post?.whoCanSee);
  const [openselectAudience, setOpenselectAudience] = useState(false);

  const handleChange = (value) => {
    setSelected(value);
  };

  const { isTyping, startTyping, stopTyping, cancelTyping } =
    useTypingComment();

  const startTypingComment = (e) => {
    if (!socketRef) return;
    socketRef.emit("joinPostCommentTyping", post?._id);
  };

  const stopTypingComment = () => {
    if (!socketRef) return;
    socketRef?.emit("leavePostCommentTyping", post?._id);
  };

  useEffect(() => {
    if (isTyping) startTypingComment();
    else stopTypingComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  useEffect(() => {
    getPostReacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const getPostReacts = async () => {
    const res = await getReacts(post?._id, user.token);
    setReacts(res.reacts);
    setCheck(res.check);
    setTotal(res.total);
    setCheckSaved(res.checkSaved);
  };

  const handleSendNotifications = (icon, type) => {
    if (user?.id !== post?.user._id) {
      
      const typeNotification =
        type === "react"
          ? post?.type === null
            ? `reacted to your post: "${post?.text}."`
            : `reacted to your photo.`
          : type === "comment"
          ? post?.type === null
            ? " commented on your post."
            : " commented on your photo."
          : null;

      // const notification = {
      //   senderId: user?.id,
      //   receiverId: post?.user._id,
      //   icon: icon,
      //   text: typeNotification,
      // };
      const notificationSocket = {
        senderId: user?.id,
        receiverId: post?.user._id,
        icon: icon,
        text: typeNotification,
        type: type,
        picture: user?.picture,
        name: user?.first_name + " " + user?.last_name,
      };
      // dispatch(
      //   createNotifications({ props: notification, token: user?.token })
      // );
      console.log(notificationSocket);
      console.log(socketRef);
      socketRef?.emit("sendNotification", notificationSocket);
    }
  };

  const reactHandler = async (type) => {
    reactPost(post?._id, type, user.token);
    if (check === type) {
      setCheck();
      let index = reacts?.findIndex((x) => x.react === check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
        setTotal((prev) => --prev);
      }
    } else {
      setCheck(type);
      let index = reacts?.findIndex((x) => x.react === type);
      let index1 = reacts?.findIndex((x) => x.react === check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);
        setTotal((prev) => ++prev);
      }
      if (index1 !== -1) {
        setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
        setTotal((prev) => --prev);
      }

      handleSendNotifications(type, "react");
    }
  };

  const showMoreReplies = () => {
    setCountReplies((prev) => prev + 3);
  };

  const showMoreRepliesThird = () => {
    setCountRepliesThird((prev) => prev + 3);
  };

  const getReplies = (commentId) =>
    post?.comments
      .filter((comment) => comment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

  const handleShowNegativePost = (id) => {
    if (profile) {
      dispatch(viewNegativePostInProfile(id));
    } else if (details) {
      dispatch(viewNegativePostDetails());
    } else {
      dispatch(viewNegativePost(id));
    }
    setIsOpenNegativePost(false);
  };

  const handleUnhideNegativeComment = () => {
    const commentId =
      activeComment?.type === "unhideComment" ? activeComment?.id : undefined;

    if (profile) {
      dispatch(
        viewNegativeCommentInProfile({
          postId: post?._id,
          commentId: commentId,
        })
      );
    } else if (details) {
      dispatch(
        viewNegativeCommentInPostDetails({
          postId: post?._id,
          commentId: commentId,
        })
      );
    } else {
      dispatch(
        viewNegativeCommentInPost({
          postId: post?._id,
          commentId: commentId,
        })
      );
    }

    setIsOpenUnhideComment(false);
  };

  return (
    <div
      className={!details ? "post-popup" : "post"}
      style={{ width: `${profile && "100%"}` }}
    >
      <div className="post_header">
        <div className="post_header_left">
          <Link to={`/profile/${post?.user.username}`}>
            <img
              src={
                post?.user?._id === user.id ? user.picture : post?.user.picture
              }
              alt=""
            />
          </Link>
          <div className="header_col">
            <Link
              to={`/profile/${post?.user.username}`}
              className="post_profile_name"
            >
              {post?.user.first_name} {post?.user.last_name}
              <div className="updated_p">
                {post?.type === "profilePicture" &&
                  `updated ${
                    post?.user.gender === "male" ? "his" : "her"
                  } profile picture`}
                {post?.type === "coverPicture" &&
                  `updated ${
                    post?.user.gender === "male" ? "his" : "her"
                  } cover picture`}
              </div>
            </Link>
            <div className="post_profile_privacy_date">
              {formatTimeOrPost(post?.createdAt)}
              <div className="relative ml-1 mr-1">
                <span
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 
                -translate-y-3/4 font-medium"
                >
                  .
                </span>
              </div>
              <div
                className="icon-audient hover1"
                onClick={() => {
                  if (post?.user?._id === user?.id) {
                    setOpenselectAudience(true);
                  }
                }}
              >
                {post?.whoCanSee === "public" ? (
                  <Public color="#828387" />
                ) : post?.whoCanSee === "friends" ? (
                  <FaUserFriends />
                ) : (
                  <HiLockClosed />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="post_header_right hover1"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <Dots color="#828387" />
        </div>
      </div>
      {post?.hidePost ? (
        <div className="mx-4 border border-solid border-gray-500 shadow-sm rounded-2xl">
          <div className="px-3 py-4 flex">
            <HiLockClosed className="mt-1 mr-3 w-10 h-10 icon-lock-hi" />
            <div>
              <div className="text-[15px] font-medium flex gap-2">
                We hide something you posted
              </div>
              <p className="text-[13px] text-gray-500 negative-post-text">
                We covered the post because it doesn't follow the
                <span className="ml-1 text-blue-500 hover:underline hover:cursor-pointer">
                  Net Friend Community Standard
                </span>
              </p>

              <div
                onClick={() => setIsOpenNegativePost(true)}
                className="text-sm font-medium text-gray-500 mt-2 hover:underline hover:cursor-pointer w-14 negative-post-btn"
              >
                Unhide
              </div>
            </div>
          </div>
        </div>
      ) : post?.background ? (
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post?.background})` }}
        >
          <div className="post_bg_text">{post?.text}</div>
        </div>
      ) : post?.type === null ? (
        <>
          <div className="post_text">{post?.text}</div>
          {post?.images && post?.images.length && (
            <div
              className={
                post?.images.length === 1
                  ? "grid_1"
                  : post?.images.length === 2
                  ? "grid_2"
                  : post?.images.length === 3
                  ? "grid_3"
                  : post?.images.length === 4
                  ? "grid_4"
                  : post?.images.length >= 5 && "grid_5"
              }
            >
              {post?.images.slice(0, 5).map((image, i) => (
                <img
                  src={image.url}
                  key={i + image.url}
                  alt=""
                  className={`img-${i}`}
                />
              ))}
              {post?.images.length > 5 && (
                <div className="more-pics-shadow">
                  +{post?.images.length - 5}
                </div>
              )}
            </div>
          )}
        </>
      ) : post?.type === "profilePicture" ? (
        <div className="post_profile_wrap">
          <div className="post_updated_bg">
            <img src={post?.user?.cover} alt="" />
          </div>
          <img
            src={post?.images ? post?.images[0]?.url : ""}
            alt=""
            className="post_updated_picture"
          />
        </div>
      ) : post?.type === "share" ? (
        <>
          <div className="post_text">{post?.text}</div>
          <div className="px-[17px] w-full">
            <div
              className=" rounded-lg 
              border-[1px] border-solid border-[#CED0D4]"
            >
              <PostShare user={user} post={post?.postRef} />
            </div>
          </div>
        </>
      ) : (
        <div className="post_cover_wrap">
          <img src={post?.images ? post?.images[0]?.url : ""} alt="" />
        </div>
      )}

      <div className="post_infos">
        <div className="reacts_count">
          <div className="reacts_count_imgs">
            {reacts &&
              reacts
                .sort((a, b) => {
                  return b.count - a.count;
                })
                .slice(0, 3)
                .map(
                  (react, i) =>
                    react.count > 0 && (
                      <img
                        key={i}
                        src={`../../../reacts/${react.react}.svg`}
                        alt=""
                      />
                    )
                )}
          </div>
          <div className="reacts_count_num">{total > 0 && total}</div>
        </div>
        <div className="to_right">
          {post?.comments?.length > 0 ? (
            <div className="comments_count">
              {post?.comments?.length} comments
            </div>
          ) : null}

          {/* <div className="share_count">0 share</div> */}
        </div>
      </div>
      <div
        className={
          post?.type === "share" ? "post-share-action" : "post_actions"
        }
      >
        <div
          className="post_action hover1 box"
          onClick={() => reactHandler(check ? check : "like")}
        >
          <ReactsPopup
            user={user}
            postId={post?._id}
            postUserId={post?.user._id}
            reactHandler={reactHandler}
          />
          <div className="post_action_reaction_wrap">
            {check ? (
              check === "like" ? (
                <div className="post_action_reaction_like_react">
                  <img
                    src={`../../../reacts/${check}.png`}
                    alt=""
                    className="like_react"
                  />
                </div>
              ) : (
                <img
                  src={`../../../reacts/${check}.svg`}
                  alt=""
                  className="small_react"
                  style={{ width: "18px" }}
                />
              )
            ) : (
              <i className="like_icon"></i>
            )}
            <span
              className="post_action_text_react"
              style={{
                color: `
            
            ${
              check === "like"
                ? "#4267b2"
                : check === "love"
                ? "#f63459"
                : check === "haha"
                ? "#f7b125"
                : check === "sad"
                ? "#f7b125"
                : check === "wow"
                ? "#f7b125"
                : check === "angry"
                ? "#e4605a"
                : ""
            }
            `,
              }}
            >
              {check ? check : "Like"}
            </span>
          </div>
        </div>
        <div className="post-popup_action hover1">
          <i className="comment_icon"></i>
          <span>Comment</span>
        </div>
        {post?.type !== "share" ? (
          <div
            className="post_action hover1"
            onClick={() => setOpenSharePost(true)}
          >
            <i className="share_icon"></i>
            <span>Share</span>
          </div>
        ) : null}
      </div>
      <div className="comments_wrap">
        <div className="comments_order"></div>

        {post?.comments && post?.comments.length > 0
          ? post?.comments
              ?.filter((backendComment) => backendComment.parentId === "")
              .sort((a, b) => {
                return new Date(a.commentAt) - new Date(b.commentAt);
              })
              .map((comment, i) => (
                <Comment
                  key={i}
                  user={user}
                  first={true}
                  isOpen={isOpen}
                  comment={comment}
                  profile={profile}
                  details={details}
                  postId={post?._id}
                  setCount={setCount}
                  dispatch={dispatch}
                  socketRef={socketRef}
                  setIsOpen={setIsOpen}
                  stopTyping={stopTyping}
                  getReplies={getReplies}
                  comments={post?.comments}
                  startTyping={startTyping}
                  postUserId={post?.user?._id}
                  cancelTyping={cancelTyping}
                  countReplies={countReplies}
                  activeOptions={activeOptions}
                  activeComment={activeComment}
                  setCountReplies={setCountReplies}
                  showMoreReplies={showMoreReplies}
                  setActiveOptions={setActiveOptions}
                  setActiveComment={setActiveComment}
                  stopTypingComment={stopTypingComment}
                  countRepliesThird={countRepliesThird}
                  repliesSecond={getReplies(comment?._id)}
                  showMoreRepliesThird={showMoreRepliesThird}
                  notificationsSelected={notificationsSelected}
                  setIsOpenUnhideComment={setIsOpenUnhideComment}
                  handleSendNotifications={handleSendNotifications}
                />
              ))
          : null}
          {/*  && !isTyping */}
        {isPostHaveTyping ? (
          <div className="comment-is-typing">
            <ThreeDotLoaderFlashing />
            <p className="text-sm font-medium">
              Some one is typing a comment...
            </p>
          </div>
        ) : null}
      </div>

      {!details ? <div className="min-h-[20vh]"></div> : null}

      <div
        className={
          !details ? "comment-input_popup scrollbar" : "w-full px-[17px] pb-2"
        }
      >
        <CreateComment
          user={user}
          profile={profile}
          details={details}
          postId={post?._id}
          setCount={setCount}
          socketRef={socketRef}
          stopTyping={stopTyping}
          startTyping={startTyping}
          postUserId={post?.user._id}
          cancelTyping={cancelTyping}
          stopTypingComment={stopTypingComment}
          handleSendNotifications={handleSendNotifications}
        />
      </div>

      {showMenu && (
        <PostMenu
          userId={user?.id}
          onClose={onClose}
          profile={profile}
          details={details}
          postId={post?._id}
          token={user?.token}
          images={post?.images}
          checkSaved={checkSaved}
          setShowMenu={setShowMenu}
          postUserId={post?.user._id}
          setCheckSaved={setCheckSaved}
          toastDetailsPost={toastDetailsPost}
          imagesLength={post?.images?.length}
        />
      )}

      <CreatePostSharePopup
        post={post}
        onClose={onClose}
        profile={profile}
        details={details}
        openSharePost={openSharePost}
        toastDetailsPost={toastDetailsPost}
        setOpenSharePost={setOpenSharePost}
      />

      <DeletePostPopUp
        open={isOpen}
        profile={profile}
        details={details}
        postId={post?._id}
        dispatch={dispatch}
        onClose={() => {
          setIsOpen(false);
          setActiveComment(null);
        }}
        props={{
          postId: post?._id,
          commentId:
            activeComment?.type === "deleteComment"
              ? activeComment?.id
              : undefined,
          token: user.token,
        }}
      >
        Are you sure you want to delete this comment?
      </DeletePostPopUp>

      <ModalCustom
        open={isOpenUnhideComment}
        title="Unhide this comment"
        onClose={() => {
          setIsOpenUnhideComment(false);
          setActiveComment(null);
        }}
        footer={
          <>
            <button
              className="modal_action"
              onClick={() => {
                handleUnhideNegativeComment();
              }}
            >
              Continue
            </button>
            <button
              className="modal_cancel"
              onClick={() => {
                setActiveComment(null);
                setIsOpenUnhideComment(false);
              }}
            >
              Cancel
            </button>
          </>
        }
      >
        <p>
          This comment may contain offensive or sensitive content. Are you sure
          you want to continue?
        </p>
      </ModalCustom>

      <ModalCustom
        open={isOpenNegativePost}
        title="Unhide this post"
        onClose={() => setIsOpenNegativePost(false)}
        footer={
          <>
            <button
              className="modal_action"
              onClick={() => {
                handleShowNegativePost(post?._id);
              }}
            >
              Continue
            </button>
            <button
              className="modal_cancel"
              onClick={() => setIsOpenNegativePost(false)}
            >
              Cancel
            </button>
          </>
        }
      >
        <p>
          This post may contain offensive or sensitive content. Are you sure you
          want to continue?
        </p>
      </ModalCustom>

      <ModalCustom
        open={openselectAudience}
        title="Select audience"
        onClose={() => setOpenselectAudience(false)}
        footer={
          <>
            <button
              className="modal_action"
              onClick={() => setOpenselectAudience(false)}
            >
              Done
            </button>
            <button
              className="modal_cancel"
              onClick={() => setOpenselectAudience(false)}
            >
              Cancel
            </button>
          </>
        }
      >
        <div
          onClick={() => handleChange("public")}
          className={`${
            selected === "public" ? "audience-select-default" : ""
          } audience-select hover:bg-[#f2f2f2] cursor-pointer h-[76px] px-[6px] 
          rounded-lg flex content-center py-[8px] gap-3`}
        >
          <div
            className="audience-icon-bg w-[60px] h-[60px] bg-[#e4e6eb] rounded-full 
          flex flex-wrap justify-center content-center"
          >
            <Public color="#000" className="audience-icon w-6 h-6" />
          </div>
          <div className="flex-1 py-3">
            <p className="text-[17px] leading-4 font-medium">Public</p>
            <p className="text-[14px] text-[#65676b]">
              Anyone on or off Net Friend
            </p>
          </div>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              class="form-checkbox h-5 w-5 text-blue-500 rounded-full 
              border-gray-300 focus:ring-0"
              checked={selected === "public"}
              onChange={() => handleChange("public")}
            />
          </label>
        </div>

        <div
          onClick={() => handleChange("friends")}
          className={`${
            selected === "friends" ? "audience-select-default" : ""
          } audience-select hover:bg-[#f2f2f2] cursor-pointer h-[76px] px-[6px] 
          rounded-lg flex content-center py-[8px] gap-3`}
        >
          <div
            className="audience-icon-bg w-[60px] h-[60px] bg-[#e4e6eb] 
          rounded-full flex flex-wrap justify-center content-center"
          >
            <FaUserFriends className="audience-icon w-6 h-6" />
          </div>
          <div className="flex-1 py-3">
            <p className="text-[17px] leading-4 font-medium">Friends</p>
            <p className="text-[14px] text-[#65676b]">
              Your friends on Net Friend
            </p>
          </div>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              class="form-checkbox h-5 w-5 text-blue-500 rounded-full 
              border-gray-300 focus:ring-0"
              checked={selected === "friends"}
              onChange={() => handleChange("friends")}
            />
          </label>
        </div>

        <div
          onClick={() => handleChange("private")}
          className={`${
            selected === "private" ? "audience-select-default" : ""
          } audience-select hover:bg-[#f2f2f2] cursor-pointer h-[76px] px-[6px] 
          rounded-lg flex content-center py-[8px] gap-3`}
        >
          <div
            className="audience-icon-bg w-[60px] h-[60px] bg-[#e4e6eb] 
          rounded-full flex flex-wrap justify-center content-center"
          >
            <HiLockClosed className="audience-icon w-6 h-6" />
          </div>
          <div className="flex-1 py-3 flex flex-wrap content-center">
            <p className="text-[17px] font-medium">Only me</p>
          </div>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              class="form-checkbox h-5 w-5 text-blue-500 rounded-full 
              border-gray-300 focus:ring-0 cursor-pointer"
              checked={selected === "private"}
              onChange={() => handleChange("private")}
            />
          </label>
        </div>
      </ModalCustom>
    </div>
  );
}
