import CreateComment from "./CreateComment";
import { useState, useRef } from "react";
import CommentOptions from "./CommentOptions";
import useClickOutside from "./../../helpers/clickOutside";
import { formatTime } from "../../functions/formatTime";
import { VscReply } from "react-icons/vsc";

export default function Comment({
  user,
  postId,
  profile,
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
  // setVisibleDelPost,
  setIsOpen,
  activeOptions,
  setActiveOptions,
  countReplies,
  showMoreReplies,
  countRepliesThird,
  showMoreRepliesThird,
  handleSendNotifications,
  setIsOpenUnhideComment,
  socketRef,
  startTyping,
  stopTyping,
  cancelTyping,
}) {
  const [parentId, setParentId] = useState("");
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
    // if (profile) {
    //   dispatch(
    //     viewNegativeCommentInProfile({
    //       postId: postId,
    //       commentId: comment?._id,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     viewNegativeCommentInPost({
    //       postId: postId,
    //       commentId: comment?._id,
    //     })
    //   );
    // }
    setIsOpenUnhideComment(true);
    setActiveComment({
      id: comment?._id,
      type: "unhideComment",
    });
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
                profile={profile}
                setCount={setCount}
                postUserId={postUserId}
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

          {comment.isFetching ? (
            <div className="comment_loading ml-[10px] text-[12px] flashing-text">
              Posting...
            </div>
          ) : (
            <div className="comment_actions">
              {!isEditing && (
                <>
                  {comment.hideComment ? (
                    <div
                      onClick={() => {
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
          )}
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
              startTyping={startTyping}
              stopTyping={stopTyping}
              cancelTyping={cancelTyping}
              profile={profile}
              setCount={setCount}
              dispatch={dispatch}
              socketRef={socketRef}
              setIsOpen={setIsOpen}
              getParentId={parentId}
              postUserId={postUserId}
              countReplies={countReplies}
              setGetParentId={setParentId}
              activeComment={activeComment}
              activeOptions={activeOptions}
              showMoreReplies={showMoreReplies}
              setActiveOptions={setActiveOptions}
              setActiveComment={setActiveComment}
              repliesThird={getReplies(reply?._id)}
              countRepliesThird={countRepliesThird}
              showMoreRepliesThird={showMoreRepliesThird}
              setIsOpenUnhideComment={setIsOpenUnhideComment}
            />
          ))}

      {countReplies < repliesSecond.length && (
        <div className="view_replies" onClick={() => showMoreReplies()}>
          <VscReply size={16} style={{ fontWeight: "bold", strokeWidth: 1 }} />
          {/* <i className="show_replies_icon mg-right-5"></i> */}{" "}
          {`${repliesSecond.length} Replies`}
        </div>
      )}

      {first && (
        <div id={comment?._id} style={{ display: "none" }}>
          <CreateComment
            user={user}
            postId={postId}
            socketRef={socketRef}
            profile={profile}
            startTyping={startTyping}
            stopTyping={stopTyping}
            cancelTyping={cancelTyping}
            setCount={setCount}
            postUserId={postUserId}
            createRelyFirstCm={true}
            handleTrigger={handleTrigger}
            getParentId={isReplying ? parentId : ""}
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
              comment={reply}
              postId={postId}
              startTyping={startTyping}
              stopTyping={stopTyping}
              cancelTyping={cancelTyping}
              profile={profile}
              dispatch={dispatch}
              setCount={setCount}
              socketRef={socketRef}
              setIsOpen={setIsOpen}
              RelyId={comment?._id}
              postUserId={postUserId}
              activeComment={activeComment}
              activeOptions={activeOptions}
              setGetParentId={setParentIdSecond}
              setActiveOptions={setActiveOptions}
              setActiveComment={setActiveComment}
              countRepliesThird={countRepliesThird}
              showMoreRepliesThird={showMoreRepliesThird}
              setIsOpenUnhideComment={setIsOpenUnhideComment}
            />
          ))}

      {countRepliesThird < repliesThird.length && (
        <div
          className="view_replies_third"
          onClick={() => showMoreRepliesThird()}
        >
          <VscReply size={16} style={{ fontWeight: "bold", strokeWidth: 1 }} />{" "}
          {`${repliesThird.length} Replies`}
        </div>
      )}

      {second && (
        <div id={comment?._id} style={{ display: "none" }}>
          <CreateComment
            user={user}
            postId={postId}
            profile={profile}
            setCount={setCount}
            socketRef={socketRef}
            startTyping={startTyping}
            stopTyping={stopTyping}
            cancelTyping={cancelTyping}
            postUserId={postUserId}
            createRelyFirstCm={false}
            createRelySecondCm={true}
            handleTrigger={handleTrigger}
            getParentId={
              isReplying || comment?._id === activeComment?.parentId
                ? parentIdSecond
                : undefined
            }
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
