import React from "react";
import ModalPost from "../modalPost";
import PostPopUp from "./PostPopUp";

const ModalPostPopUp = ({
  open,
  post,
  profile,
  user,
  socketRef,
  onClose,
}) => {
  return (
    <>
      <ModalPost
        open={open}
        title={`${post?.user.first_name} ${post?.user.last_name}'s Post`}
        onClose={onClose}
        footer={<></>}
      >
        <PostPopUp
          user={user}
          post={post}
          key={post?._id}
          onClose={onClose}
          profile={profile}
          socketRef={socketRef}
        />
      </ModalPost>
    </>
  );
};

export default ModalPostPopUp;
