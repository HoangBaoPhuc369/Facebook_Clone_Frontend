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
import ModalCustom from "../Modal";
import { Public } from "../../svg";
import { FaUserFriends } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi";
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

  const [selected, setSelected] = useState("public");
  const [openselectAudience, setOpenselectAudience] = useState(false);

  const handleChange = (value) => {
    setSelected(value);
  };

  // useClickOutside(popup, () => {
  //   setVisible(false);
  // });
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
            whoCanSee: selected,
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
            whoCanSee: selected,
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
            whoCanSee: selected,
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
            whoCanSee: selected,
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
            whoCanSee: selected,
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
            whoCanSee: selected,
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
                <div
                  className="box_privacy"
                  onClick={() => setOpenselectAudience(true)}
                >
                  {selected === "public" ? (
                    <>
                      <div className="h-6 flex flex-wrap content-center py-0">
                        <Public color="#000" />
                      </div>
                      <span>Public</span>
                    </>
                  ) : selected === "friends" ? (
                    <>
                      <div className="h-6 flex flex-wrap content-center py-0">
                        <FaUserFriends />
                      </div>
                      <span>Friends</span>
                    </>
                  ) : (
                    <>
                      <div className="h-6 flex flex-wrap content-center py-0">
                        <HiLockClosed />
                      </div>
                      <span>Private</span>
                    </>
                  )}
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
          className="hover:bg-[#f2f2f2] cursor-pointer h-[76px] px-[6px] rounded-lg flex content-center py-[8px] gap-3"
        >
          <div className="w-[60px] h-[60px] bg-[#e4e6eb] rounded-full flex flex-wrap justify-center content-center">
            <Public color="#000" className="w-6 h-6" />
          </div>
          <div className="flex-1 py-3">
            <p className="text-[17px] leading-4 font-medium">Public</p>
            <p className="text-[15px] text-[#65676b]">
              Anyone on or off Net Friend
            </p>
          </div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-0"
              checked={selected === "public"}
              onChange={() => handleChange("public")}
            />
          </label>
        </div>

        <div
          onClick={() => handleChange("friends")}
          className="hover:bg-[#f2f2f2] cursor-pointer h-[76px] px-[6px] rounded-lg flex content-center py-[8px] gap-3"
        >
          <div className="w-[60px] h-[60px] bg-[#e4e6eb] rounded-full flex flex-wrap justify-center content-center">
            <FaUserFriends className="w-6 h-6" />
          </div>
          <div className="flex-1 py-3">
            <p className="text-[17px] leading-4 font-medium">Friends</p>
            <p className="text-[15px] text-[#65676b]">
              Your friends on Net Friend
            </p>
          </div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-0"
              checked={selected === "friends"}
              onChange={() => handleChange("friends")}
            />
          </label>
        </div>

        <div
          onClick={() => handleChange("private")}
          className="hover:bg-[#f2f2f2] cursor-pointer h-[76px] px-[6px] rounded-lg flex content-center py-[8px] gap-3"
        >
          <div className="w-[60px] h-[60px] bg-[#e4e6eb] rounded-full flex flex-wrap justify-center content-center">
            <HiLockClosed className="w-6 h-6" />
          </div>
          <div className="flex-1 py-3 flex flex-wrap content-center">
            <p className="text-[17px] font-medium">Only me</p>
          </div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500 rounded-full border-gray-300 focus:ring-0 cursor-pointer"
              checked={selected === "private"}
              onChange={() => handleChange("private")}
            />
          </label>
        </div>
      </ModalCustom>
    </>
  );
}
