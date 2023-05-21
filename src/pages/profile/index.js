import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { profileReducer } from "../../functions/reducers";
import Header from "../../components/header";
import "./style.css";
import Cover from "./Cover";
import ProfileMenu from "./ProfileMenu";
import PplYouMayKnow from "./PplYouMayKnow";
import CreatePost from "../../components/createPost";
import GridPosts from "./GridPosts";
import Post from "../../components/post";
import Photos from "./Photos";
import Friends from "./Friends";
import Intro from "../../components/intro";
import { useMediaQuery } from "react-responsive";
import CreatePostPopup from "../../components/createPostPopup";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { HashLoader } from "react-spinners";
import {
  getNewCommentPostProfile,
  getNewPostProfile,
  getProfile,
} from "../../redux/features/profileSlice";
import ProfilePictureInfos from "./ProfilePictureInfos";
import PostSkeleton from "../../components/postSkeleton";
export default function Profile({
  socketRef,
  onlineUser,
  setOnlineUsers,
  setPostShare,
  setIsProfile,
  setsharePostPopUp,
  toastDetailsPost,
}) {
  const [visible, setVisible] = useState(false);
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { profile, photos, loading } = useSelector((state) => ({
    ...state.profile,
  }));
  var userName = username === undefined ? user.username : username;

  var visitor = userName === user.username ? false : true;
  const path = `${userName}/*`;
  const max = 30;
  const sort = "desc";

  useEffect(() => {
    dispatch(
      getProfile({ userName, token: user?.token, path, sort, max, navigate })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  useEffect(() => {
    if (socketRef) {
      socketRef.on("newComment", (data) => {
        dispatch(getNewCommentPostProfile(data));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socketRef) {
      socketRef.on("newPost", (data) => {
        dispatch(getNewPostProfile(data));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profileTop = useRef(null);
  const leftSide = useRef(null);
  const [height, setHeight] = useState();
  const [leftHeight, setLeftHeight] = useState();
  const [scrollHeight, setScrollHeight] = useState();
  useEffect(() => {
    setHeight(profileTop?.current?.clientHeight + 269); // + 300 (height of the "you may know" component)
    setLeftHeight(leftSide?.current?.clientHeight);
    window.addEventListener("scroll", getScroll, { passive: true });
    return () => {
      window.addEventListener("scroll", getScroll, { passive: true });
      setHeight();
      setLeftHeight();
    };
  }, [loading, scrollHeight]);
  const check = useMediaQuery({
    query: "(min-width:901px)",
  });
  const getScroll = () => {
    setScrollHeight(window.pageYOffset);
  };

  return (
    <div className="profile">
      <CreatePostPopup
        profile
        visible={visible}
        setVisible={setVisible}
        toastDetailsPost={toastDetailsPost}
      />

      <div className="profile_top" ref={profileTop}>
        <div className="profile_container">
          {loading ? (
            <>
              <div className="profile_cover">
                <Skeleton
                  height="347px"
                  containerClassName="avatar-skeleton"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div
                className="profile_img_wrap"
                style={{
                  marginBottom: "-3rem",
                  transform: "translateY(-8px)",
                }}
              >
                <div className="profile_w_left">
                  <Skeleton
                    circle
                    height="180px"
                    width="180px"
                    containerClassName="avatar-skeleton"
                    style={{ transform: "translateY(-3.3rem)" }}
                  />
                  <div className="profile_w_col">
                    <div className="profile_name">
                      <Skeleton
                        height="35px"
                        width="200px"
                        containerClassName="avatar-skeleton"
                      />
                      <Skeleton
                        height="30px"
                        width="100px"
                        containerClassName="avatar-skeleton"
                        style={{ transform: "translateY(2.5px)" }}
                      />
                    </div>
                    <div className="profile_friend_count">
                      <Skeleton
                        height="20px"
                        width="90px"
                        containerClassName="avatar-skeleton"
                        style={{ marginTop: "5px" }}
                      />
                    </div>
                    <div className="profile_friend_imgs">
                      {Array.from(new Array(6), (val, i) => i + 1).map(
                        (id, i) => (
                          <Skeleton
                            key={i}
                            circle
                            height="32px"
                            width="32px"
                            containerClassName="avatar-skeleton"
                            style={{ transform: `translateX(${-i * 7}px)` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className={`friendship ${!visitor && "fix"}`}>
                  <Skeleton
                    height="36px"
                    width={120}
                    containerClassName="avatar-skeleton"
                  />
                  <div className="flex gap-[10px]">
                    <Skeleton
                      height="36px"
                      width={120}
                      containerClassName="avatar-skeleton"
                    />
                    {visitor && (
                      <Skeleton
                        height="36px"
                        width={120}
                        containerClassName="avatar-skeleton"
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Cover
                cover={profile.cover}
                visitor={visitor}
                photos={photos.resources}
                profilePost={profile?.posts}
                dispatch={dispatch}
              />
              <ProfilePictureInfos
                profile={profile}
                visitor={visitor}
                photos={photos.resources}
                otherName={profile?.details?.otherName}
                loading={loading}
                profilePost={profile?.posts}
                dispatch={dispatch}
              />
            </>
          )}

          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            {!loading ? (
              <div
                className={`profile_grid ${
                  check && scrollHeight >= height && leftHeight > 1000
                    ? "scrollFixed showLess"
                    : check &&
                      scrollHeight >= height &&
                      leftHeight < 1000 &&
                      "scrollFixed showMore"
                }`}
              >
                <div className="profile_left" ref={leftSide}>
                  {/* {loading ? (
                    <>
                      <div className="profile_card">
                        <div className="profile_card_header">Intro</div>
                        <div className="sekelton_loader">
                          <HashLoader color="#1876f2" />
                        </div>
                      </div>
                      <div className="profile_card">
                        <div className="profile_card_header">
                          Photos
                          <div className="profile_header_link">
                            See all photos
                          </div>
                        </div>
                        <div className="sekelton_loader">
                          <HashLoader color="#1876f2" />
                        </div>
                      </div>
                      <div className="profile_card">
                        <div className="profile_card_header">
                          Friends
                          <div className="profile_header_link">
                            See all friends
                          </div>
                        </div>
                        <div className="sekelton_loader">
                          <HashLoader color="#1876f2" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                     
                    </>
                  )} */}
                  <Intro detailss={profile.details} visitor={visitor} />
                  <Photos
                    username={userName}
                    token={user.token}
                    photos={photos}
                  />
                  <Friends friends={profile.friends} />
                  <div className="relative_fb_copyright">
                    <Link to="/">Privacy </Link>
                    <span>. </span>
                    <Link to="/">Terms </Link>
                    <span>. </span>
                    <Link to="/">Advertising </Link>
                    <span>. </span>
                    <Link to="/">
                      Ad Choices <i className="ad_choices_icon"></i>{" "}
                    </Link>
                    <span>. </span>
                    <Link to="/"></Link>Cookies <span>. </span>
                    <Link to="/">More </Link>
                    <span>. </span> <br />
                    Meta © 2022
                  </div>
                </div>
                <div className="profile_right">
                  {!visitor && (
                    <CreatePost user={user} profile setVisible={setVisible} />
                  )}
                  <GridPosts />
                  {/* {loading ? (
                    <div className="skeleton_loader">
                      <PostSkeleton />
                    </div>
                  ) : (
                    
                  )} */}

                  <div className="posts">
                    {profile.posts && profile.posts.length ? (
                      profile.posts.map((post) => (
                        <Post
                          profile
                          user={user}
                          post={post}
                          key={post?._id}
                          socketRef={socketRef}
                          setIsProfile={setIsProfile}
                          setPostShare={setPostShare}
                          toastDetailsPost={toastDetailsPost}
                          setsharePostPopUp={setsharePostPopUp}
                        />
                      ))
                    ) : (
                      <div className="no_posts">No posts available</div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
