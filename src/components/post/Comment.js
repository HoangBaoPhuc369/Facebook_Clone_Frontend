import Moment from "react-moment";

export default function Comment({
  comment,
  repliesSecond = [],
  repliesThird,
  getReplies,
}) {
  return (
    <>
      <div className="comment">
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
            <span>Like</span>
            <span>Reply</span>
            <span>
              <Moment fromNow interval={30}>
                {comment.commentAt}
              </Moment>
            </span>
          </div>
        </div>

        <span className="recursive"></span>
      </div>

      {repliesSecond && repliesSecond.length > 0 && (
        <div className="replies-second">
          {repliesSecond.map((reply, i) => (
            <Comment
              comment={reply}
              repliesThird={getReplies(reply?._id)}
              key={i}
            />
          ))}
        </div>
      )}

      {repliesThird && repliesThird.length > 0 && (
        <div className="replies-third">
          {repliesThird.map((reply, i) => (
            <Comment comment={reply} key={i} />
          ))}
        </div>
      )}
    </>
  );
}
