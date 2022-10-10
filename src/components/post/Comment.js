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
}) {
  const isReplying =
    activeComment &&
    activeComment.id === comment?._id &&
    activeComment.type === "replying";

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
          />
        ))}

      {first && isReplying && <CreateComment user={user} createRelyFirstCm={true} />}

      {repliesThird &&
        repliesThird.length > 0 &&
        repliesThird.map((reply, i) => (
          <Comment
            user={user}
            comment={reply}
            first={false}
            second={false}
            third={true}
            key={i}
            setActiveComment={setActiveComment}
            activeComment={activeComment}
          />
        ))}

      {second && isReplying && (
        <CreateComment
          user={user}
          createRelyFirstCm={false}
          createRelySecondCm={true}
        />
      )}
    </>
  );
}
