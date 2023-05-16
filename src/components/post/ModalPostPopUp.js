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
  toastDetailsPost,
  handleSendNotifications,
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
          toastDetailsPost={toastDetailsPost}
          handleSendNotifications={handleSendNotifications}
        />
      </ModalPost>
    </>
  );
};

export default ModalPostPopUp;
