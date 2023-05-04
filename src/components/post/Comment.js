import CreateComment from "./CreateComment";
import { useState, useRef } from "react";
import CommentOptions from "./CommentOptions";
import useClickOutside from "./../../helpers/clickOutside";
import { viewNegativeCommentInUserPost } from "../../redux/features/profileSlice";
import { viewNegativeCommentInPost } from "../../redux/features/postSlice";
import { formatTime } from "../../functions/formatTime";

export default function Comment({
  user,
  postId,
  setComments,
  setCount,
  comment,
  first,
  second,
  third,
  dispatch,
  postUserId,
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
  countReplies,
  showMoreReplies,
  countRepliesThird,
  showMoreRepliesThird,
  handleSendNotifications,
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

  const handleViewNegativeComment = () => {
    if (postUserId === user.id) {
      dispatch(
        viewNegativeCommentInUserPost({
          postId: postId,
          commentId: comment?._id,
        })
      );
    } else {
      dispatch(
        viewNegativeCommentInPost({
          postId: postId,
          commentId: comment?._id,
        })
      );
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
        <img
          src={
            comment.commentBy?._id === user.id
              ? user.picture
              : comment.commentBy.picture
          }
          alt=""
          className="comment_img"
        />
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
                  <div className="comment_text">
                    {comment.hideComment
                      ? "This comment is hidden because it might be offensive"
                      : comment.comment}
                  </div>
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
                        user={user}
                        setIsOpen={setIsOpen}
                        comment={comment}
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
                handleSendNotifications={handleSendNotifications}
                activeComment={isEditing ? activeComment : undefined}
              />
            )}
          </div>

          {comment.image && (
            <img src={comment.image} alt="" className="comment_image" />
          )}
          <div className="comment_actions">
            {!isEditing && (
              <>
                {comment.hideComment ? (
                  <div
                    onClick={() => {
                      console.log(comment?._id);
                      handleViewNegativeComment();
                    }}
                  >
                    Unhide
                  </div>
                ) : (
                  <>
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
                  </>
                )}

                <span>{formatTime(comment.commentAt)}</span>
              </>
            )}

            {isEditing && (
              <div
                className="comment_actions-cancel"
                onClick={() => setActiveComment(null)}
              >
                Cancel
              </div>
            )}
          </div>
        </div>
      </div>

      {repliesSecond &&
        repliesSecond.length > 0 &&
        repliesSecond
          .slice(0, countReplies)
          .map((reply, i) => (
            <Comment
              key={i}
              user={user}
              first={false}
              second={true}
              third={false}
              comment={reply}
              postId={postId}
              setCount={setCount}
              dispatch={dispatch}
              postUserId={postUserId}
              setIsOpen={setIsOpen}
              getParentId={parentId}
              setComments={setComments}
              countReplies={countReplies}
              setGetParentId={setParentId}
              activeComment={activeComment}
              activeOptions={activeOptions}
              showMoreReplies={showMoreReplies}
              setActiveOptions={setActiveOptions}
              setActiveComment={setActiveComment}
              repliesThird={getReplies(reply?._id)}
              setVisibleDelPost={setVisibleDelPost}
              countRepliesThird={countRepliesThird}
              showMoreRepliesThird={showMoreRepliesThird}
            />
          ))}

      {countReplies < repliesSecond.length && (
        <div className="view_replies" onClick={() => showMoreReplies()}>
          <i className="show_replies_icon mg-right-5"></i>{" "}
          {`${repliesSecond.length} Replies`}
        </div>
      )}

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
            handleSendNotifications={handleSendNotifications}
            activeComment={isReplying ? activeComment : undefined}
          />
        </div>
      )}

      {repliesThird &&
        repliesThird.length > 0 &&
        repliesThird
          .slice(0, countRepliesThird)
          .map((reply, i) => (
            <Comment
              key={i}
              user={user}
              third={true}
              first={false}
              second={false}
              postId={postId}
              comment={reply}
              dispatch={dispatch}
              setCount={setCount}
              setIsOpen={setIsOpen}
              RelyId={comment?._id}
              postUserId={postUserId}
              setComments={setComments}
              activeComment={activeComment}
              activeOptions={activeOptions}
              setGetParentId={setParentIdSecond}
              setActiveOptions={setActiveOptions}
              setActiveComment={setActiveComment}
              setVisibleDelPost={setVisibleDelPost}
              countRepliesThird={countRepliesThird}
              showMoreRepliesThird={showMoreRepliesThird}
            />
          ))}

      {countRepliesThird < repliesThird.length && (
        <div
          className="view_replies_third"
          onClick={() => showMoreRepliesThird()}
        >
          <i className="show_replies_icon mg-right-5"></i>{" "}
          {`${repliesThird.length} Replies`}
        </div>
      )}

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
            handleSendNotifications={handleSendNotifications}
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
