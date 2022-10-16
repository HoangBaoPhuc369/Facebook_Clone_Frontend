import Moment from "react-moment";
import CreateComment from "./CreateComment";
import { useState, useEffect, Fragment } from "react";
import CommentOptions from "./CommentOptions";
import { useRef } from "react";
import useClickOutside from "./../../helpers/clickOutside";

export default function Comment({
  user,
  postId,
  setComments,
  setCount,
  comment,
  first,
  second,
  third,
  repliesSecond = [],
  repliesThird = [],
  setActiveComment,
  activeComment,
  getReplies,
  RelyId,
  setGetParentId,
  setVisibleDelPost,
}) {
  const [parentId, setParentId] = useState(null);
  const [parentIdSecond, setParentIdSecond] = useState(null);
  const [showOptionComment, setShowOptionComment] = useState(false);

  const commentOptionsRef = useRef(null);
  useClickOutside(commentOptionsRef, () => {
    setShowOptionComment(false);
  });

  const isReplying =
    activeComment &&
    activeComment.id === comment?._id &&
    activeComment.type === "replying";

  const isChooseOptions =
    activeComment &&
    activeComment.id === comment?._id &&
    activeComment.type === "chooseOptions";

  const showReplyForm = (relyId) => {
    if (relyId) {
      const element = document.getElementById(relyId);
      element.style.display = "block";
    }
  };

  return (
    <>
      <div
        className={
          first
            ? "comment"
            : second
            ? "comment comment-second"
            : third
            ? "comment comment-third"
            : ""
        }
      >
        <img src={comment.commentBy.picture} alt="" className="comment_img" />
        <div className="comment_col">
          <div className="comment_wrap">
            <div className="comment_wrap_comment">
              <div className="comment_name">
                {comment.commentBy.first_name} {comment.commentBy.last_name}
              </div>
              <div className="comment_text">{comment.comment}</div>
            </div>

            <div className="comment_options">
              <div className="comment_options-wrap" ref={commentOptionsRef}>
                <div
                  className="comment_options_icon"
                  onClick={() => {
                    setActiveComment({
                      id: comment?._id,
                      type: "chooseOptions",
                    });

                    setShowOptionComment((prev) => !prev);
                  }}
                >
                  <span>...</span>
                </div>
                {isChooseOptions && showOptionComment && <CommentOptions />}
              </div>
            </div>
          </div>
          {comment.image && (
            <img src={comment.image} alt="" className="comment_image" />
          )}
          <div className="comment_actions">
            <div>Like</div>
            <div
              onClick={() => {
                setActiveComment({
                  id: comment?._id,
                  parentId: comment?.parentId,
                  type: "replying",
                });

                if (first || second) {
                  showReplyForm(comment?._id);
                } else if (third) {
                  showReplyForm(RelyId);
                }

                first && setParentId(comment?._id);
                second && setParentIdSecond(comment?._id);
                third && setGetParentId(comment.parentId);
              }}
            >
              Reply
            </div>
            <span>
              <Moment fromNow interval={30}>
                {comment.commentAt}
              </Moment>
            </span>
          </div>
        </div>
      </div>

      {repliesSecond &&
        repliesSecond.length > 0 &&
        repliesSecond.map((reply, i) => (
          <Comment
            user={user}
            first={false}
            second={true}
            third={false}
            getParentId={parentId}
            setGetParentId={setParentId}
            comment={reply}
            postId={postId}
            setCount={setCount}
            setComments={setComments}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            repliesThird={getReplies(reply?._id)}
            setVisibleDelPost={setVisibleDelPost}
            key={i}
          />
        ))}

      {first && (
        <div id={comment?._id} style={{ display: "none" }}>
          <CreateComment
            user={user}
            postId={postId}
            setCount={setCount}
            getParentId={isReplying ? parentId : undefined}
            createRelyFirstCm={true}
            setComments={setComments}
            activeComment={isReplying ? activeComment : undefined}
          />
        </div>
      )}

      {repliesThird &&
        repliesThird.length > 0 &&
        repliesThird.map((reply, i) => (
          <Comment
            key={i}
            user={user}
            third={true}
            first={false}
            second={false}
            postId={postId}
            comment={reply}
            setCount={setCount}
            RelyId={comment?._id}
            setComments={setComments}
            activeComment={activeComment}
            setGetParentId={setParentIdSecond}
            setActiveComment={setActiveComment}
            setVisibleDelPost={setVisibleDelPost}
          />
        ))}

      {second && (
        <div id={comment?._id} style={{ display: "none" }}>
          <CreateComment
            user={user}
            postId={postId}
            setCount={setCount}
            createRelyFirstCm={false}
            createRelySecondCm={true}
            getParentId={
              isReplying || comment?._id === activeComment?.parentId
                ? parentIdSecond
                : undefined
            }
            setComments={setComments}
            activeComment={
              isReplying || comment?._id === activeComment?.parentId
                ? activeComment
                : undefined
            }
          />
        </div>
      )}
    </>
  );
}
