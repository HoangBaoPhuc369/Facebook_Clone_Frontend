import { Link } from "react-router-dom";
import "./style.css";
import Moment from "react-moment";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useEffect, useRef, useState } from "react";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import { getReacts, reactPost } from "../../functions/post";
import Comment from "./Comment";
import DeletePostPopUp from "../deletePost";
export default function Post({ user, post, profile, setVisibleDelPost }) {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reacts, setReacts] = useState();
  const [check, setCheck] = useState();
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(1);
  const [checkSaved, setCheckSaved] = useState();

  const postRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [countReplies, setCountReplies] = useState(0);
  const [countRepliesThird, setCountRepliesThird] = useState(0);
  const [activeComment, setActiveComment] = useState(null);
  const [activeOptions, setActiveOptions] = useState(null);

  useEffect(() => {
    setComments(post?.comments);
  }, [post]);

  useEffect(() => {
    getPostReacts();
  }, [post]);

  const getPostReacts = async () => {
    const res = await getReacts(post._id, user.token);
    setReacts(res.reacts);
    setCheck(res.check);
    setTotal(res.total);
    setCheckSaved(res.checkSaved);
  };

  const reactHandler = async (type) => {
    reactPost(post._id, type, user.token);
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
        // console.log(reacts);
      }
      if (index1 !== -1) {
        setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
        setTotal((prev) => --prev);
        // console.log(reacts);
      }
    }
  };

  const showMore = () => {
    setCount((prev) => prev + 3);
  };

  const showMoreReplies = () => {
    setCountReplies((prev) => prev + 3);
  };

  const showMoreRepliesThird = () => {
    setCountRepliesThird((prev) => prev + 3);
  };

  const getReplies = (commentId) =>
    comments
      .filter((comment) => comment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

  return (
    <div
      className="post"
      style={{ width: `${profile && "100%"}` }}
      ref={postRef}
    >
      <div className="post_header">
        <Link
          to={`/profile/${post?.user.username}`}
          className="post_header_left"
        >
          <img
            src={post.user?._id === user.id ? user.picture : post.user.picture}
            alt=""
          />
          <div className="header_col">
            <div className="post_profile_name">
              {post.user.first_name} {post.user.last_name}
              <div className="updated_p">
                {post.type == "profilePicture" &&
                  `updated ${
                    post.user.gender == "male" ? "his" : "her"
                  } profile picture`}
                {post.type == "coverPicture" &&
                  `updated ${
                    post.user.gender == "male" ? "his" : "her"
                  } cover picture`}
              </div>
            </div>
            <div className="post_profile_privacy_date">
              <Moment fromNow interval={30}>
                {post.createdAt}
              </Moment>
              . <Public color="#828387" />
            </div>
          </div>
        </Link>
        <div
          className="post_header_right hover1"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <Dots color="#828387" />
        </div>
      </div>
      {post.background ? (
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post.background})` }}
        >
          <div className="post_bg_text">{post.text}</div>
        </div>
      ) : post.type === null ? (
        <>
          <div className="post_text">{post.text}</div>
          {post.images && post.images.length && (
            <div
              className={
                post.images.length === 1
                  ? "grid_1"
                  : post.images.length === 2
                  ? "grid_2"
                  : post.images.length === 3
                  ? "grid_3"
                  : post.images.length === 4
                  ? "grid_4"
                  : post.images.length >= 5 && "grid_5"
              }
            >
              {post.images.slice(0, 5).map((image, i) => (
                <img
                  src={image.url}
                  key={i + image.url}
                  alt=""
                  className={`img-${i}`}
                />
              ))}
              {post.images.length > 5 && (
                <div className="more-pics-shadow">
                  +{post.images.length - 5}
                </div>
              )}
            </div>
          )}
        </>
      ) : post.type === "profilePicture" ? (
        <div className="post_profile_wrap">
          <div className="post_updated_bg">
            <img src={post.user.cover} alt="" />
          </div>
          <img
            src={post.images[0].url}
            alt=""
            className="post_updated_picture"
          />
        </div>
      ) : (
        <div className="post_cover_wrap">
          <img src={post.images[0].url} alt="" />
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
          {comments?.length > 0 ? (
            <div className="comments_count">{comments?.length} comments</div>
          ) : null}

          {/* <div className="share_count">0 share</div> */}
        </div>
      </div>
      <div className="post_actions">
        <div
          className="post_action hover1 box"
          onMouseOver={() => {
            setTimeout(() => {
              setVisible(true);
            }, 500);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setVisible(false);
            }, 500);
          }}
          onClick={() => reactHandler(check ? check : "like")}
        >
          <ReactsPopup reactHandler={reactHandler} />
          {check ? (
            <img
              src={`../../../reacts/${check}.svg`}
              alt=""
              className="small_react"
              style={{ width: "18px" }}
            />
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
        <div className="post_action hover1">
          <i className="comment_icon"></i>
          <span>Comment</span>
        </div>
        {user.following.length > 0 && (
          <div className="post_action hover1">
            <i className="share_icon"></i>
            <span>Share</span>
          </div>
        )}
      </div>
      <div className="comments_wrap">
        <div className="comments_order"></div>

        <CreateComment
          user={user}
          postId={post._id}
          setCount={setCount}
          setComments={setComments}
        />

        {comments &&
          comments
            .filter((backendComment) => backendComment.parentId === "")
            .sort((a, b) => {
              return new Date(b.commentAt) - new Date(a.commentAt);
            })
            .slice(0, count)
            .map((comment, i) => (
              <Comment
                key={i}
                user={user}
                first={true}
                isOpen={isOpen}
                postId={post._id}
                comment={comment}
                setCount={setCount}
                setIsOpen={setIsOpen}
                getReplies={getReplies}
                setComments={setComments}
                countReplies={countReplies}
                activeOptions={activeOptions}
                activeComment={activeComment}
                setCountReplies={setCountReplies}
                showMoreReplies={showMoreReplies}
                setActiveOptions={setActiveOptions}
                setActiveComment={setActiveComment}
                setVisibleDelPost={setVisibleDelPost}
                countRepliesThird={countRepliesThird}
                repliesSecond={getReplies(comment?._id)}
                showMoreRepliesThird={showMoreRepliesThird}
              />
            ))}

        {count <
          comments.filter((backendComment) => backendComment.parentId === "")
            .length && (
          <div className="view_comments" onClick={() => showMore()}>
            View more comments
          </div>
        )}
      </div>
      {showMenu && (
        <PostMenu
          userId={user.id}
          postRef={postRef}
          postId={post._id}
          token={user.token}
          images={post.images}
          checkSaved={checkSaved}
          setShowMenu={setShowMenu}
          postUserId={post.user._id}
          setCheckSaved={setCheckSaved}
          imagesLength={post?.images?.length}
        />
      )}

      <DeletePostPopUp
        open={isOpen}
        setComments={setComments}
        onClose={() => setIsOpen(false)}
        props={{
          postId: post._id,
          commentId:
            activeComment?.type === "deleteComment"
              ? activeComment?.id
              : undefined,
          token: user.token,
        }}
      >
        Are you sure you want to delete this comment?
      </DeletePostPopUp>
    </div>
  );
}
