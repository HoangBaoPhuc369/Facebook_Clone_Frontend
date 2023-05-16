import "./style.css";
import { Dots, Public } from "../../svg";
import { formatTimeOrPost } from "../../functions/formatTime";
import { FaUserFriends } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi";

export default function PostShare({ user, post }) {
  return (
    <div className="post-share">
      <div className="post_header">
        <div className="post_header_left">
          <div>
            <img
              src={
                post?.user?._id === user?.id
                  ? user?.picture
                  : post?.user?.picture
              }
              alt=""
            />
          </div>
          <div className="header_col">
            <div className="post_profile_name">
              {post?.user?.first_name} {post?.user?.last_name}
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
            </div>
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
              <div className="icon-audient hover1">
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
                // onClick={() => setIsOpenNegativePost(true)}
                className="text-sm font-medium text-gray-500 mt-2 hover:underline hover:cursor-pointer w-14 negative-post-btn"
              >
                Unhide
              </div>
            </div>
          </div>
        </div>
      ) : post?.background ? (
        <div
          className="post_bg bottom-radius-post"
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
            <img src={post.user.cover} alt="" />
          </div>
          <img
            src={post?.images ? post.images[0]?.url : ""}
            alt=""
            className="post_updated_picture"
          />
        </div>
      ) : (
        <div className="post-share_cover_wrap">
          <img src={post?.images ? post.images[0]?.url : ""} alt="" />
        </div>
      )}
    </div>
  );
}
