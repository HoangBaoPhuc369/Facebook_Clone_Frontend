import Moment from "react-moment";
import CreateComment from "./CreateComment";
import { useState, useEffect } from "react";

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

}) {
  
  const [parentId, setParentId] = useState(null);
  const [parentIdSecond, setParentIdSecond] = useState(null);

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
                  parentId: comment?.parentId,
                  type: "replying",
                });

                if (first || second) {
                  showReplyForm(comment?._id);
                } else if(third) {
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
            // getParentId={parentIdSecond}
            setGetParentId={setParentIdSecond}
            RelyId={comment?._id}
            setComments={setComments}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
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
            getParentId={(isReplying || comment?._id === activeComment?.parentId) ? parentIdSecond : undefined}
            setComments={setComments}
            activeComment={(isReplying || comment?._id === activeComment?.parentId) ? activeComment : undefined}
          />
        </div>
      )}
    </>
  );
}
