import { useRef, useState } from "react";
import "./style.css";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import AddToYourPost from "./AddToYourPost";
import ImagePreview from "./ImagePreview";
import useClickOutside from "../../helpers/clickOutside";
import PostError from "./PostError";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
import { useSelector, useDispatch } from "react-redux";
import { createPost, setPostLoading } from "../../redux/features/postSlice";
import {
  createPostProfile,
  setPostProfileLoading,
} from "../../redux/features/profileSlice";
import { PuffLoader, PulseLoader } from "react-spinners";
export default function CreatePostPopup({ visible, setVisible, profile }) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { errorCreatePost, loadingCreatePost } = useSelector((state) => ({
    ...state.newFeed,
  }));
  const { loadingPosts } = useSelector((state) => ({
    ...state.profile,
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
      if (!profile) {
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
      } else {
        dispatch(
          createPostProfile({
            type: null,
            background,
            text: text,
            images: null,
            user: user.id,
            token: user.token,
          })
        );
      }
      setBackground("");
      setText("");
      setVisible(false);
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

      if (profile) {
        dispatch(setPostProfileLoading(true));
      } else {
        dispatch(setPostLoading(true));
      }

      setText("");
      setImages("");
      setVisible(false);

      const response = await uploadImages(formData, user.token);
      if (!profile) {
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
      } else {
        dispatch(
          createPostProfile({
            type: null,
            background: null,
            text: text,
            images: response,
            user: user.id,
            token: user.token,
          })
        );
      }
    } else if (text) {
      if (!profile) {
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
      } else {
        dispatch(
          createPostProfile({
            type: null,
            background: null,
            text: text,
            images: null,
            user: user.id,
            token: user.token,
          })
        );
      }
      setBackground("");
      setText("");
      setVisible(false);
    } else {
      console.log("something went wrong");
    }
  };

  return (
    <>
      {visible ? (
        <div className="blur-background">
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
              Post
            </button>
          </div>
        </div>
      ) : null}

      {loadingCreatePost || loadingPosts ? (
        <div className="blur-background">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative text-[22px] create-post-text">
              Posting...
              <div className="absolute top-[-80px] right-[84px]">
                <PuffLoader />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
