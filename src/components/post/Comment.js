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
  details,
  setCount,
  comment,
  comments,
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
  setIsOpen,
  activeOptions,
  setActiveOptions,
  countReplies,
  showMoreReplies,
  // countRepliesThird,
  // showMoreRepliesThird,
  setIsOpenUnhideComment,
  socketRef,
  startTyping,
  stopTyping,
  cancelTyping,
  stopTypingComment,
  notificationsSelected,
}) {
  const [parentId, setParentId] = useState("");
  const [countRepliesSecond, setCountRepliesSecond] = useState(3);
  const [countRepliesThird, setCountRepliesThird] = useState(3);
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
    setIsOpenUnhideComment(true);
    setActiveComment({
      id: comment?._id,
      type: "unhideComment",
    });
  };

  const showMoreRepliesSecond = () => {
    setCountRepliesSecond((prev) => prev + 3);
  };

  const countNestedComments = (data, id) => {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId === id) {
        count++;
        count += countNestedComments(data, data[i]._id);
      }
    }
    return count;
  };

  const count = () => {
    if (first) {
      return countNestedComments(comments, comment?._id);
    }
  };

  function handleCountCommentsById(data, parentCommentId) {
    let count = 0;
    const level2Comments = data.filter(
      (comment) => comment.parentId === parentCommentId
    );
    for (let i = 0; i < level2Comments.length; i++) {
      const level3Comments = data.filter(
        (comment) => comment.parentId === level2Comments[i]._id
      );
      count += level3Comments.length;
    }
    return count;
  }

  const handleCountComments = (countRepliesSecond) => {
    if (countRepliesSecond === 0 && first) {
      return count() - countRepliesSecond;
    } else {
      return count() - countRepliesSecond - countThird();
    }
  };

  const countThird = () => {
    if (first) {
      return handleCountCommentsById(comments, comment?._id);
    }
  };

  const showMoreRepliesThird = () => {
    setCountRepliesThird((prev) => prev + 3);
  };

  // const checkMsg = () => {
  //   if (details) {
  //     console.log(notificationsSelected)
  //     console.log(comment?._id)
  //   }
  // };

  // checkMsg()

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
                <div
                  className={`comment_wrap_comment ${
                    details &&
                    notificationsSelected &&
                    notificationsSelected.commentId === comment?._id
                      ? "comment-notification"
                      : "test"
                  }`}
                >
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
                details={details}
                setCount={setCount}
                postUserId={postUserId}
                initialText={comment.comment}
                setActiveComment={setActiveComment}
                stopTypingComment={stopTypingComment}
                handleTriggerEdit={handleTriggerEdit}
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
          .slice(0, countRepliesSecond)
          .sort((a, b) => {
            return new Date(a.commentAt) - new Date(b.commentAt);
          })
          .map((reply, i) => (
            <Comment
              key={i}
              user={user}
              first={false}
              second={true}
              third={false}
              comment={reply}
              postId={postId}
              profile={profile}
              details={details}
              comments={comments}
              setCount={setCount}
              dispatch={dispatch}
              socketRef={socketRef}
              setIsOpen={setIsOpen}
              getParentId={parentId}
              stopTyping={stopTyping}
              postUserId={postUserId}
              startTyping={startTyping}
              cancelTyping={cancelTyping}
              countReplies={countReplies}
              setGetParentId={setParentId}
              activeComment={activeComment}
              activeOptions={activeOptions}
              showMoreReplies={showMoreReplies}
              setActiveOptions={setActiveOptions}
              setActiveComment={setActiveComment}
              stopTypingComment={stopTypingComment}
              repliesThird={getReplies(reply?._id)}
              countRepliesThird={countRepliesThird}
              showMoreRepliesThird={showMoreRepliesThird}
              notificationsSelected={notificationsSelected}
              setIsOpenUnhideComment={setIsOpenUnhideComment}
            />
          ))}

      {countRepliesSecond < repliesSecond.length && (
        <div className="view_replies" onClick={() => showMoreRepliesSecond()}>
          <VscReply size={16} style={{ fontWeight: "bold", strokeWidth: 1 }} />
          {handleCountComments(countRepliesSecond)} Replies
          {/* {repliesSecond.length} Replies */}
        </div>
      )}

      {first && (
        <div id={comment?._id} style={{ display: "none" }}>
          <CreateComment
            user={user}
            postId={postId}
            profile={profile}
            details={details}
            setCount={setCount}
            socketRef={socketRef}
            stopTyping={stopTyping}
            postUserId={postUserId}
            createRelyFirstCm={true}
            startTyping={startTyping}
            cancelTyping={cancelTyping}
            handleTrigger={handleTrigger}
            stopTypingComment={stopTypingComment}
            getParentId={isReplying ? parentId : ""}
            activeComment={isReplying ? activeComment : undefined}
          />
        </div>
      )}

      {repliesThird &&
        repliesThird.length > 0 &&
        repliesThird
          .slice(0, countRepliesThird)
          .sort((a, b) => {
            return new Date(a.commentAt) - new Date(b.commentAt);
          })
          .map((reply, i) => (
            <Comment
              key={i}
              user={user}
              third={true}
              first={false}
              second={false}
              postId={postId}
              comment={reply}
              profile={profile}
              details={details}
              comments={comments}
              dispatch={dispatch}
              setCount={setCount}
              socketRef={socketRef}
              setIsOpen={setIsOpen}
              RelyId={comment?._id}
              postUserId={postUserId}
              stopTyping={stopTyping}
              startTyping={startTyping}
              cancelTyping={cancelTyping}
              activeComment={activeComment}
              activeOptions={activeOptions}
              setGetParentId={setParentIdSecond}
              setActiveOptions={setActiveOptions}
              setActiveComment={setActiveComment}
              stopTypingComment={stopTypingComment}
              countRepliesThird={countRepliesThird}
              showMoreRepliesThird={showMoreRepliesThird}
              notificationsSelected={notificationsSelected}
              setIsOpenUnhideComment={setIsOpenUnhideComment}
            />
          ))}

      {countRepliesThird < repliesThird.length && (
        <div
          className="view_replies_third"
          onClick={() => showMoreRepliesThird()}
        >
          <VscReply size={16} style={{ fontWeight: "bold", strokeWidth: 1 }} />{" "}
          {`${repliesThird.length - countRepliesThird} Replies`}
        </div>
      )}

      {second && (
        <div id={comment?._id} style={{ display: "none" }}>
          <CreateComment
            user={user}
            postId={postId}
            profile={profile}
            details={details}
            setCount={setCount}
            socketRef={socketRef}
            postUserId={postUserId}
            stopTyping={stopTyping}
            startTyping={startTyping}
            createRelyFirstCm={false}
            createRelySecondCm={true}
            cancelTyping={cancelTyping}
            handleTrigger={handleTrigger}
            stopTypingComment={stopTypingComment}
            getParentId={
              isReplying || comment?._id === activeComment?.parentId
                ? parentIdSecond
                : undefined
            }
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
