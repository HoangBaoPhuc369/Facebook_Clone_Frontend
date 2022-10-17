import Moment from "react-moment";
import CreateComment from "./CreateComment";
import { useState, useRef } from "react";
import CommentOptions from "./CommentOptions";
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
  setIsOpen,
  activeOptions,
  setActiveOptions,
}) {
  const [parentId, setParentId] = useState(null);
  const [parentIdSecond, setParentIdSecond] = useState(null);
  const [showOptionComment, setShowOptionComment] = useState(false);

  const triggerRef = useRef(null);
  const triggerEditRef = useRef(null);

  const commentOptionsRef = useRef(null);
  useClickOutside(commentOptionsRef, () => {
    setShowOptionComment(false);
  });

  const isReplying =
    activeComment &&
    activeComment.id === comment?._id &&
    activeComment.type === "replying";

  const isEditing =
    activeComment &&
    activeComment.id === comment?._id &&
    activeComment.type === "editing";

  const isChooseOptions =
    activeOptions &&
    activeOptions.id === comment?._id &&
    activeOptions.type === "chooseOptions";

  const showReplyForm = (relyId) => {
    if (relyId) {
      const element = document.getElementById(relyId);
      element.style.display = "block";
    }
  };

  const handleTrigger = () => {
    triggerRef.current.click();
  };

  const handleTriggerEdit = () => {
    triggerEditRef.current.click();
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
            <input
              ref={triggerEditRef}
              type="hidden"
              onClick={() => {
                setActiveComment({ id: comment?._id, type: "editing" });
              }}
            />
            <input
              type="hidden"
              ref={triggerRef}
              onClick={() => {
                setActiveComment({
                  id: comment?._id,
                  parentId: comment?.parentId,
                  type: "replying",
                });
              }}
            />
            {!isEditing && (
              <>
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
                        setActiveOptions({
                          id: comment?._id,
                          type: "chooseOptions",
                        });

                        setShowOptionComment((prev) => !prev);
                      }}
                    >
                      <span>...</span>
                    </div>

                    {isChooseOptions && showOptionComment && (
                      <CommentOptions
                        setIsOpen={setIsOpen}
                        commentId={comment?._id}
                        setActiveComment={setActiveComment}
                        setShowOptionComment={setShowOptionComment}
                      />
                    )}
                  </div>
                </div>
              </>
            )}

            {isEditing && (
              <CreateComment
                user={user}
                postId={postId}
                setCount={setCount}
                setComments={setComments}
                initialText={comment.comment}
                setActiveComment={setActiveComment}
                handleTriggerEdit={handleTriggerEdit}
                activeComment={isEditing ? activeComment : undefined}
              />
            )}
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
            key={i}
            user={user}
            first={false}
            second={true}
            third={false}
            comment={reply}
            postId={postId}
            setCount={setCount}
            setIsOpen={setIsOpen}
            getParentId={parentId}
            setComments={setComments}
            setGetParentId={setParentId}
            activeComment={activeComment}
            activeOptions={activeOptions}
            setActiveOptions={setActiveOptions}
            setActiveComment={setActiveComment}
            repliesThird={getReplies(reply?._id)}
            setVisibleDelPost={setVisibleDelPost}
          />
        ))}

      {first && (
        <div id={comment?._id} style={{ display: "none" }}>
          <CreateComment
            user={user}
            postId={postId}
            setCount={setCount}
            createRelyFirstCm={true}
            setComments={setComments}
            handleTrigger={handleTrigger}
            getParentId={isReplying ? parentId : undefined}
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
            setIsOpen={setIsOpen}
            RelyId={comment?._id}
            setComments={setComments}
            activeComment={activeComment}
            activeOptions={activeOptions}
            setGetParentId={setParentIdSecond}
            setActiveOptions={setActiveOptions}
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
            handleTrigger={handleTrigger}
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
