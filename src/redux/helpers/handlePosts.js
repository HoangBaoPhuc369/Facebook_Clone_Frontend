export const showNegativeComment = (props) => {
  const findPost = props.posts?.find((p) => p._id === props.postId);
  if (findPost) {
    const findCommnent = findPost.comments.find(
      (c) => c._id === props.commentId
    );
    if (findCommnent) {
      findCommnent.hideComment = false;
    }
  }
};

export const showNegativePost = (props) => {
  const findPost = props.posts?.find((p) => p._id === props.postId);
  if (findPost) {
    findPost.hidePost = false;
  }
};

export const showNegativePostShare = (props) => {
  const findPost = props.posts?.find((p) => p._id === props.postId);
  if (findPost) {
    findPost.postRef.hidePost = false;
  }
};

export const createComment = (props) => {
  const findPost = props.posts?.find((p) => p._id === props.postId);
  if (findPost) {
    // const result = props.comments
    //   .map((newComment) => {
    //     const oldComment = findPost.comments.find(
    //       (oldComment) => oldComment._id === newComment._id
    //     );
    //     if (oldComment) {
    //       return { ...newComment, hideComment: oldComment.hideComment };
    //     } else {
    //       return newComment;
    //     }
    //   })
    //   .filter(Boolean);

    findPost.comments = props.comments;
  }
};

export const createCommentLoading = (props) => {
  const findPost = props.posts?.find((p) => p._id === props.postId);
  if (findPost) {
    findPost.comments = [props.comment, ...findPost.comments];
  }
};

export const editCommentLoading = (props) => {
  const findPost = props.posts?.find((p) => p._id === props.postId);
  if (findPost) {
    const findCommnent = findPost.comments.find(
      (c) => c._id === props.commentId
    );
    if (findCommnent) {
      findCommnent.comment = props.comment.comment;
      findCommnent.image = props.comment.image;
      findCommnent.isFetching = props.comment.isFetching;
    }
  }
};

export const replaceComment = (props) => {
  const findPost = props.posts?.find((p) => p._id === props.postId);
  if (findPost) {
    // const result = findPost.comments
    //   .map((oldComment) => {
    //     const newComment = props.comments.find(
    //       (newComment) => newComment._id === oldComment._id
    //     );
    //     return newComment
    //       ? { ...newComment, hideComment: oldComment.hideComment }
    //       : undefined;
    //   })
    //   .filter(Boolean);
    findPost.comments = props.comments;
  }
};
