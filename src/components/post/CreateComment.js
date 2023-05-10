import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { uploadImages } from "../../functions/uploadImages";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { ClipLoader } from "react-spinners";
import {
  createCommentInProfilePost,
  editCommentInProfilePost,
} from "../../redux/features/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  createCommentPost,
  createCommentPostLoading,
  editCommentPost,
} from "../../redux/features/postSlice";
import { v4 as uuidv4 } from "uuid";

export default function CreateComment({
  user,
  postId,
  profile,
  setCount,
  getParentId,
  handleTrigger,
  activeComment,
  initialText = "",
  createRelyFirstCm,
  handleTriggerEdit,
  createRelySecondCm,
  setActiveComment = null,
  handleSendNotifications,
}) {
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState();
  const textRef = useRef(null);
  const imgInput = useRef(null);

  const { loadingComment } = useSelector((state) => ({ ...state.profile }));
  const { loadingCommentPost } = useSelector((state) => ({ ...state.newFeed }));

  const dispatch = useDispatch();

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  useEffect(() => {
    if (getParentId) {
      textRef.current.focus();
    }
  }, [getParentId, activeComment]);
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
    if (e.key === "Enter") {
      if (activeComment?.type === "editing") {
        if (commentImage !== "") {
          const img = dataURItoBlob(commentImage);
          const path = `${user.username}/post_images/${postId}`;
          let formData = new FormData();
          formData.append("path", path);
          formData.append("file", img);
          const imgComment = await uploadImages(formData, path, user.token);

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
          setText("");
          setCommentImage("");
          setActiveComment(null);
        } else if (text !== "") {
          if (profile) {
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
          setText("");
          setCommentImage("");
          handleSendNotifications("comment", "comment");
        } else if (text !== "") {
          if (profile) {
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
          <img src={user?.picture} className="rely-comment-img" alt="" />
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
          <input
            type="text"
            value={text}
            ref={textRef}
            onClick={() =>
              handleTriggerEdit
                ? handleTriggerEdit()
                : handleTrigger
                ? handleTrigger()
                : null
            }
            onKeyUp={handleComment}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
          />
          {/* {getParentId ? getParentId : "Write a comment..."} */}
          <div className="comment_circle" style={{ marginTop: "5px" }}>
            <ClipLoader
              size={20}
              color="#1876f2"
              loading={loadingComment || loadingCommentPost}
            />
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => {
              setPicker((prev) => !prev);
            }}
          >
            <i className="emoji_icon"></i>
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => imgInput.current.click()}
          >
            <i className="camera_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="gif_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="sticker_icon"></i>
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
