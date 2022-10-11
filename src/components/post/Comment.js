import Moment from "react-moment";
import CreateComment from "./CreateComment";
import { useState } from "react";

export default function Comment({
  user,
  comment,
  first,
  second,
  third,
  repliesSecond = [],
  repliesThird = [],
  setActiveComment,
  activeComment,
  getReplies,
  showReplies,
  setShowReplies,
  RelyId,
}) {
  const isReplying =
    activeComment &&
    activeComment.id === comment?._id &&
    activeComment.type === "replying";

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
            <div className="comment_name">
              {comment.commentBy.first_name} {comment.commentBy.last_name}
            </div>
            <div className="comment_text">{comment.comment}</div>
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
                  name:
                    comment.commentBy.first_name +
                    " " +
                    comment.commentBy.last_name,
                  type: "replying",
                });
                setShowReplies(true);
                first  && showReplyForm(comment?._id);
                second && showReplyForm(comment?._id);
                third && showReplyForm(RelyId);
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
            comment={reply}
            repliesThird={getReplies(reply?._id)}
            first={false}
            second={true}
            third={false}
            key={i}
            setActiveComment={setActiveComment}
            activeComment={activeComment}
            showReplies={showReplies}
            setShowReplies={setShowReplies}
            getReplies={getReplies}
          />
        ))}

      {first && (
        <div id={comment?._id} style={{ display: "none" }}>
          <CreateComment user={user} createRelyFirstCm={true} />
        </div>
      )}

      {repliesThird &&
        repliesThird.length > 0 &&
        repliesThird.map((reply, i) => (
          <Comment
            user={user}
            comment={reply}
            RelyId={comment?._id}
            first={false}
            second={false}
            third={true}
            key={i}
            setActiveComment={setActiveComment}
            activeComment={activeComment}
            setShowReplies={setShowReplies}
            getReplies={getReplies}
          />
        ))}

      {second && (
        <div id={comment?._id} style={{ display: "none" }}>
          <CreateComment
            user={user}
            createRelyFirstCm={false}
            createRelySecondCm={true}
          />
        </div>
      )}

      {/* {third && (
        <CreateComment
          user={user}
          RelyId={comment?._id}
          createRelyFirstCm={false}
          createRelySecondCm={false}
          createRelyThirdCm={true}
        />
      )} */}
    </>
  );
}
