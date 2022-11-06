import { useRef, useState } from "react";
import "./style.css";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import AddToYourPost from "./AddToYourPost";
import ImagePreview from "./ImagePreview";
import useClickOutside from "../../helpers/clickOutside";
import PulseLoader from "react-spinners/PulseLoader";
import PostError from "./PostError";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
import { useSelector, useDispatch } from "react-redux";
import { createPost } from "../../redux/features/postSlice";
export default function CreatePostPopup({ setVisible }) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { errorCreatePost, loadingCreatePost } = useSelector((state) => ({
    ...state.newFeed,
  }));
  const dispatch = useDispatch();
  const popup = useRef(null);
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");
  useClickOutside(popup, () => {
    setVisible(false);
  });
  const postSubmit = async () => {
    if (background) {
      dispatch(
        createPost({
          type: null,
          background,
          text: text,
          images: null,
          user: user.id,
          token: user.token,
        })
      );
      if (errorCreatePost === "") {
        setBackground("");
        setText("");
        setVisible(false);
      }
    } else if (images && images.length) {
      const postImages = images.map((img) => {
        return dataURItoBlob(img);
      });
      const path = `${user.username}/post_images`;
      let formData = new FormData();
      formData.append("path", path);
      postImages.forEach((image) => {
        formData.append("file", image);
      });
      const response = await uploadImages(formData, user.token);
      // const res = await createPost(
      //   null,
      //   null,
      //   text,
      //   response,
      //   user.id,
      //   user.token
      // );
      // setLoading(false);
      // if (res.status === "ok") {
      //   dispatch({
      //     type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
      //     payload: [res.data, ...posts],
      //   });
      //   setText("");
      //   setImages("");
      //   setVisible(false);
      // } else {
      //   setError(res);
      // }

      dispatch(
        createPost({
          type: null,
          background: null,
          text: text,
          images: response,
          user: user.id,
          token: user.token,
        })
      );
      if (errorCreatePost === "") {
        setText("");
        setImages("");
        setVisible(false);
      }
    } else if (text) {
      dispatch(
        createPost({
          type: null,
          background: null,
          text: text,
          images: null,
          user: user.id,
          token: user.token,
        })
      );
      if (errorCreatePost === "") {
        setBackground("");
        setText("");
        setVisible(false);
      }
    } else {
      console.log("something went wrong");
    }
  };
  return (
    <div className="blur">
      <div className="postBox" ref={popup}>
        {errorCreatePost && <PostError error={errorCreatePost} />}
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setVisible(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user.first_name} {user.last_name}
            </div>
            <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Public</span>
              <i className="arrowDown_icon"></i>
            </div>
          </div>
        </div>

        {!showPrev ? (
          <>
            <EmojiPickerBackgrounds
              text={text}
              user={user}
              setText={setText}
              showPrev={showPrev}
              setBackground={setBackground}
              background={background}
            />
          </>
        ) : (
          <ImagePreview
            text={text}
            user={user}
            setText={setText}
            showPrev={showPrev}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
          />
        )}
        <AddToYourPost setShowPrev={setShowPrev} />
        <button
          className="post_submit"
          onClick={() => {
            postSubmit();
          }}
          disabled={loadingCreatePost}
        >
          {loadingCreatePost ? <PulseLoader color="#fff" size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
}
