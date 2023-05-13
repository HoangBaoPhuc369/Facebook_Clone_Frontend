import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { uploadImages } from "../../functions/uploadImages";
import dataURItoBlob from "../../helpers/dataURItoBlob";
// import { ClipLoader } from "react-spinners";
import {
  createCommentInProfilePost,
  createCommentPostProfileLoading,
  editCommentInProfilePost,
  editCommentPostProfileLoading,
} from "../../redux/features/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  createCommentPost,
  createCommentPostLoading,
  editCommentPost,
  editCommentPostLoading,
} from "../../redux/features/postSlice";
import { v4 as uuidv4 } from "uuid";
import SentIcon from "./../../svg/sentIcon";
import useTypingComment from "../../hooks/useTypingComment";

export default function CreateComment({
  user,
  postId,
  profile,
  setCount,
  socketRef,
  getParentId,
  handleTrigger,
  activeComment,
  initialText = "",
  createRelyFirstCm,
  handleTriggerEdit,
  createRelySecondCm,
  setActiveComment = null,
  handleSendNotifications,
  startTyping,
  stopTyping,
  cancelTyping,
  stopTypingComment,
}) {
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState();

  // const { startTyping, stopTyping, cancelTyping } = useTypingComment();

  const textRef = useRef(null);
  const imgInput = useRef(null);

  // const { loadingComment } = useSelector((state) => ({ ...state.profile }));
  // const { loadingCommentPost } = useSelector((state) => ({ ...state.newFeed }));

  const dispatch = useDispatch();

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

  useEffect(() => {
    if (getParentId) {
      textRef.current.focus();
    }
  }, [getParentId, activeComment]);

  // const handleInput = (event) => {
  //   const textarea = textRef.current;

  //   if (textarea.scrollHeight > parseInt(35)) {
  //     textarea.style.height = `${textarea.scrollHeight}px`;
  //   }
  // };

  const adjustTextareaHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  };

  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };
  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} is too large max 5mb allowed.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setCommentImage(event.target.result);
    };
  };
  const handleComment = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (activeComment?.type === "editing") {
        if (commentImage !== "") {
          const img = dataURItoBlob(commentImage);
          const path = `${user.username}/post_images/${postId}`;
          let formData = new FormData();
          formData.append("path", path);
          formData.append("file", img);

          setText("");
          setCommentImage("");

          if (profile) {
            dispatch(
              editCommentPostProfileLoading({
                postId: postId,
                comment: {
                  comment: text,
                  image: commentImage,
                  isFetching: true,
                },
                commentId: activeComment.id,
              })
            );
          } else {
            dispatch(
              editCommentPostLoading({
                postId: postId,
                comment: {
                  comment: text,
                  image: commentImage,
                  isFetching: true,
                },
                commentId: activeComment.id,
              })
            );
          }

          const imgComment = await uploadImages(formData, user.token);

          if (imgComment) {
            if (profile) {
              dispatch(
                editCommentInProfilePost({
                  id: activeComment.id,
                  postId: postId,
                  comment: text,
                  image: imgComment[0].url,
                  token: user.token,
                })
              );
            } else {
              dispatch(
                editCommentPost({
                  id: activeComment.id,
                  postId: postId,
                  comment: text,
                  image: imgComment[0].url,
                  token: user.token,
                })
              );
            }
          }

          setActiveComment(null);
        } else if (text !== "") {
          if (profile) {
            dispatch(
              editCommentPostProfileLoading({
                postId: postId,
                comment: {
                  comment: text,
                  image: "",
                  isFetching: true,
                },
                commentId: activeComment.id,
              })
            );

            dispatch(
              editCommentInProfilePost({
                id: activeComment.id,
                postId: postId,
                comment: text,
                image: "",
                token: user.token,
              })
            );
          } else {
            dispatch(
              editCommentPostLoading({
                postId: postId,
                comment: {
                  comment: text,
                  image: "",
                  isFetching: true,
                },
                commentId: activeComment.id,
              })
            );
            dispatch(
              editCommentPost({
                id: activeComment.id,
                postId: postId,
                comment: text,
                image: "",
                token: user.token,
              })
            );
          }

          setText("");
          setCommentImage("");
          setActiveComment(null);
        }
      } else {
        if (commentImage !== "") {
          const img = dataURItoBlob(commentImage);
          const path = `${user.username}/post_images/${postId}`;
          let formData = new FormData();
          formData.append("path", path);
          formData.append("file", img);

          setText("");
          setCommentImage("");

          if (profile) {
            dispatch(
              createCommentPostProfileLoading({
                postId,
                comment: {
                  comment: text,
                  image: commentImage,
                  parentId: getParentId === undefined ? "" : getParentId,
                  isFetching: true,
                  commentBy: {
                    _id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    picture: user.picture,
                  },
                  hideComment: false,
                  commentAt: new Date().toISOString(),
                  _id: uuidv4(),
                },
              })
            );
          } else {
            dispatch(
              createCommentPostLoading({
                postId,
                comment: {
                  comment: text,
                  image: commentImage,
                  parentId: getParentId === undefined ? "" : getParentId,
                  isFetching: true,
                  commentBy: {
                    _id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    picture: user.picture,
                  },
                  hideComment: false,
                  commentAt: new Date().toISOString(),
                  _id: uuidv4(),
                },
              })
            );
          }

          const imgComment = await uploadImages(formData, user.token);

          if (imgComment) {
            if (profile) {
              dispatch(
                createCommentInProfilePost({
                  postId,
                  getParentId,
                  comment: text,
                  image: imgComment[0].url,
                  token: user.token,
                })
              );
            } else {
              dispatch(
                createCommentPost({
                  postId,
                  getParentId,
                  comment: text,
                  image: imgComment[0].url,
                  token: user.token,
                })
              );
            }
          }
          setCount((prev) => ++prev);
          // setText("");
          // setCommentImage("");
          1("comment", "comment");
        } else if (text !== "") {
          if (profile) {
            dispatch(
              createCommentPostProfileLoading({
                postId,
                comment: {
                  comment: text,
                  image: "",
                  parentId: getParentId === undefined ? "" : getParentId,
                  isFetching: true,
                  commentBy: {
                    _id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    picture: user.picture,
                  },
                  hideComment: false,
                  commentAt: new Date().toISOString(),
                  _id: uuidv4(),
                },
              })
            );

            dispatch(
              createCommentInProfilePost({
                postId,
                getParentId,
                comment: text,
                image: "",
                token: user.token,
              })
            );
          } else {
            dispatch(
              createCommentPostLoading({
                postId,
                comment: {
                  comment: text,
                  image: "",
                  parentId: getParentId === undefined ? "" : getParentId,
                  isFetching: true,
                  commentBy: {
                    _id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    picture: user.picture,
                  },
                  hideComment: false,
                  commentAt: new Date().toISOString(),
                  _id: uuidv4(),
                },
              })
            );

            dispatch(
              createCommentPost({
                postId,
                getParentId,
                comment: text,
                image: "",
                token: user.token,
              })
            );
          }

          setCount((prev) => ++prev);
          setText("");
          setCommentImage("");
          handleSendNotifications("comment", "comment");
        }
      }

      cancelTyping();
    }
  };

  return (
    <div
      className={
        createRelyFirstCm
          ? "create_comment_wrap create_comment-reply-first"
          : createRelySecondCm
          ? "create_comment_wrap create_comment-reply-second"
          : "create_comment_wrap"
      }
    >
      <div className="create_comment">
        {activeComment?.type === "editing" ? (
          ""
        ) : (
          <img src={user?.picture} className="mt-[3px]" alt="" />
        )}

        <div className="comment_input_wrap">
          {picker && (
            <div className="comment_emoji_picker">
              <Picker onEmojiClick={handleEmoji} />
            </div>
          )}
          <input
            type="file"
            hidden
            ref={imgInput}
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImage}
          />
          {error && (
            <div className="postError comment_error">
              <div className="postError_error">{error}</div>
              <button className="blue_btn" onClick={() => setError("")}>
                Try again
              </button>
            </div>
          )}
          <textarea
            type="text"
            value={text}
            ref={textRef}
            rows="1"
            className="textarea-comment focus:outline-none focus:ring-0"
            onClick={() =>
              handleTriggerEdit
                ? handleTriggerEdit()
                : handleTrigger
                ? handleTrigger()
                : null
            }
            // onInput={handleInput}
            onKeyPress={startTyping}
            onKeyUp={(e) => {
              stopTyping();
              if (e.key === "Enter" && e.target.value !== "") {
                stopTypingComment();
                handleComment(e);
              }
            }}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
          />
          {/* <div className="comment_circle" style={{ marginTop: "5px" }}>
            <ClipLoader
              size={20}
              color="#1876f2"
              loading={loadingComment || loadingCommentPost}
            />
          </div> */}
          <div className="flex gap-0 px-[9px] py-[5px] ">
            <div
              className="comment_circle_icon cursor-pointer hover2"
              onClick={() => {
                setPicker((prev) => !prev);
              }}
            >
              <i className="emoji_icon"></i>
            </div>
            <div
              className="comment_circle_icon cursor-pointer hover2"
              onClick={() => imgInput.current.click()}
            >
              <i className="camera_icon"></i>
            </div>
            <div className="comment_circle_icon cursor-pointer hover2">
              <i className="gif_icon"></i>
            </div>
            <div className="comment_circle_icon cursor-pointer hover2">
              <i className="sticker_icon"></i>
            </div>
            <div className="flex-1 flex justify-end">
              <div
                className={`${
                  text !== ""
                    ? "comment_circle_icon hover2 "
                    : "h-[30px] w-[30px] grid place-items-center cursor-not-allowed"
                }`}
                onClick={(e) => {
                  if (text !== "") {
                    handleComment(e);
                  }
                }}
              >
                <SentIcon
                  color={`${text !== "" ? "#1876f2" : "#bec3c9"}`}
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="" />
          <div
            className="small_white_circle"
            onClick={() => setCommentImage("")}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </div>
  );
}
