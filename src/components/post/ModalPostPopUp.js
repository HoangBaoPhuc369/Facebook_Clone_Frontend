import React from "react";
import ModalPost from "../modalPost";
import Post from "../../components/post";
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
          post={post}
          profile={profile}
          key={post?._id}
          user={user}
          socketRef={socketRef}
        />
      </ModalPost>
    </>
  );
};

export default ModalPostPopUp;
