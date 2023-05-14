import { useEffect, useRef, useState } from "react";
import "./style.css";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import PostError from "./PostError";
import { useSelector, useDispatch } from "react-redux";
import { createPost } from "../../redux/features/postSlice";
import { createPostProfile } from "../../redux/features/profileSlice";
import { PuffLoader } from "react-spinners";
import ModalCustom from "../Modal";
import { Public } from "../../svg";
import { FaUserFriends } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi";
import { createPostDetails } from "../../redux/features/notificationSlice";

export default function CreatePostSharePopup({
  post,
  profile,
  details,
  onClose,
  openSharePost,
  setOpenSharePost,
}) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { errorCreatePost, loadingCreatePost } = useSelector((state) => ({
    ...state.newFeed,
  }));
  const { loadingPosts } = useSelector((state) => ({
    ...state.profile,
  }));

  const { loadingPostDetails } = useSelector((state) => ({
    ...state.notification,
  }));
  const dispatch = useDispatch();
  const popup = useRef(null);
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [background, setBackground] = useState("");

  const [selected, setSelected] = useState("public");
  const [selectedDefault, setSelectedDefault] = useState("");
  const [openselectAudience, setOpenselectAudience] = useState(false);

  const handleChange = (value) => {
    setSelected(value);
  };

  useEffect(() => {
    setSelectedDefault(selected);
  }, []);

  const postSubmit = async () => {
    if (text) {
      if (!profile) {
        dispatch(
          createPost({
            type: "share",
            postRef: post?._id,
            background: null,
            text: text,
            images: null,
            user: user.id,
            token: user.token,
            whoCanSee: selected,
          })
        );
      } else if (details) {
        dispatch(
          createPostDetails({
            type: "share",
            postRef: post?._id,
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
            type: "share",
            postRef: post?._id,
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
      setOpenSharePost(false);
      if (!details) {
        onClose();
      }
    } else {
      console.log("something went wrong");
    }
  };

  return (
    <>
      {openSharePost ? (
        <div className="blur-background">
          <div className="postBox" ref={popup}>
            {errorCreatePost && <PostError error={errorCreatePost} />}
            <div className="box_header">
              <div
                className="small_circle"
                onClick={() => {
                  setOpenSharePost(false);
                }}
              >
                <i className="exit_icon"></i>
              </div>
              <span>Write Post</span>
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
                      <div className="audience-selected-public h-6 flex flex-wrap content-center py-0">
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

            <>
              <EmojiPickerBackgrounds
                text={text}
                user={user}
                post={post}
                setText={setText}
                showPrev={showPrev}
                setBackground={setBackground}
                background={background}
              />
            </>

            <button
              className="post_submit"
              onClick={() => {
                postSubmit();
              }}
              disabled={loadingCreatePost}
            >
              Share
            </button>
          </div>
        </div>
      ) : null}

      {loadingCreatePost || loadingPosts || loadingPostDetails ? (
        <div className="blur-background-popup">
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
          className={`${
            selectedDefault === "public" ? "audience-select-default" : ""
          } audience-select hover:bg-[#f2f2f2] cursor-pointer h-[76px] px-[6px] 
          rounded-lg flex content-center py-[8px] gap-3`}
        >
          <div className="audience-icon-bg w-[60px] h-[60px] bg-[#e4e6eb] rounded-full flex flex-wrap justify-center content-center">
            <Public color="#000" className="audience-icon w-6 h-6" />
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
          className={`${
            selectedDefault === "friends" ? "audience-select-default" : ""
          } audience-select hover:bg-[#f2f2f2] cursor-pointer h-[76px] px-[6px] 
          rounded-lg flex content-center py-[8px] gap-3`}
        >
          <div
            className="audience-icon-bg w-[60px] h-[60px] bg-[#e4e6eb] rounded-full flex flex-wrap 
          justify-center content-center"
          >
            <FaUserFriends className="audience-icon w-6 h-6" />
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
          className={`${
            selectedDefault === "private" ? "audience-select-default" : ""
          } audience-select hover:bg-[#f2f2f2] cursor-pointer h-[76px] px-[6px] 
          rounded-lg flex content-center py-[8px] gap-3`}
        >
          <div className="audience-icon-bg w-[60px] h-[60px] bg-[#e4e6eb] rounded-full flex flex-wrap justify-center content-center">
            <HiLockClosed className="audience-icon w-6 h-6" />
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
