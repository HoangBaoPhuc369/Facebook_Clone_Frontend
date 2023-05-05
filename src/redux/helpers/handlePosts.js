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

export const replaceComment = (props) => {
  const findPost = props.posts?.find((p) => p._id === props.postId);
  if (findPost) {
    const result = findPost.comments
      .map((element1) => {
        const element2 = props.comments.find(
          (element2) => element2._id === element1._id
        );
        return element2 ? { ...element1, hide: element1.hide } : undefined;
      })
      .filter(Boolean);

    findPost.comments = result;
  }
};
