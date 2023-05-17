import { useRef, useState } from "react";
import MenuItem from "./MenuItem";
import useOnClickOutside from "../../helpers/clickOutside";
import { savePost } from "../../functions/post";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { deletePost } from "../../redux/features/postSlice";
import { deletePostProfile } from "../../redux/features/profileSlice";
import { deletePostDetails } from "../../redux/features/notificationSlice";
import { useNavigate } from "react-router-dom";

export default function PostMenu({
  token,
  userId,
  images,
  postId,
  onClose,
  details,
  profile,
  checkSaved,
  postUserId,
  setShowMenu,
  imagesLength,
  setCheckSaved,
  toastDetailsPost,
}) {
  const [test, setTest] = useState(postUserId === userId ? true : false);
  const menu = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useOnClickOutside(menu, () => setShowMenu(false));
  const saveHandler = async () => {
    savePost(postId, token);
    if (checkSaved) {
      setCheckSaved(false);
    } else {
      setCheckSaved(true);
    }
  };
  const downloadImages = async () => {
    images.map((img) => saveAs(img.url, "image.jpg"));
  };
  const deleteHandler = () => {
    if (!profile) {
      dispatch(
        deletePost({
          postId,
          token,
          toastDetailsPost: toastDetailsPost,
        })
      );
    } else if (details) {
      // dispatch(
      //   deletePost({
      //     postId,
      //     token,
      //     toastDetailsPost: toastDetailsPost,
      //   })
      // );
      dispatch(
        deletePostDetails({
          postId,
          token,
          navigate,
          toastDetailsPost: toastDetailsPost,
        })
      );
      // dispatch(
      //   deletePostProfile({
      //     postId,
      //     token,
      //   })
      // );
    } else {
      dispatch(
        deletePostProfile({
          postId,
          token,
          toastDetailsPost: toastDetailsPost,
        })
      );
    }
    // if (!details) {
    //   onClose();
    // }
  };
  return (
    <ul className="post_menu" ref={menu}>
      {test && <MenuItem icon="pin_icon" title="Pin Post" />}
      <div onClick={() => saveHandler()}>
        {checkSaved ? (
          <MenuItem
            icon="save_icon"
            title="Unsave Post"
            subtitle="Remove this from your saved items."
          />
        ) : (
          <MenuItem
            icon="save_icon"
            title="Save Post"
            subtitle="Add this to your saved items."
          />
        )}
      </div>
      <div className="line"></div>
      {test && <MenuItem icon="edit_icon" title="Edit Post" />}
      {!test && (
        <MenuItem
          icon="turnOnNotification_icon"
          title="Turn on notifications for this post"
        />
      )}
      {imagesLength && (
        <div onClick={() => downloadImages()}>
          <MenuItem icon="download_icon" title="Download" />
        </div>
      )}
      {imagesLength && (
        <MenuItem icon="fullscreen_icon" title="Enter Fullscreen" />
      )}
      {test && <MenuItem img="../../../icons/lock.png" title="Edit audience" />}
      {test && (
        <MenuItem
          icon="turnOffNotifications_icon"
          title="Turn off notifications for this post"
        />
      )}
      {test && <MenuItem icon="delete_icon" title="Turn off translations" />}
      {test && <MenuItem icon="date_icon" title="Edit Date" />}
      {test && (
        <MenuItem icon="refresh_icon" title="Refresh share attachment" />
      )}
      {test && <MenuItem icon="archive_icon" title="Move to archive" />}
      {test && (
        <div onClick={() => deleteHandler()}>
          <MenuItem
            icon="trash_icon"
            title="Move to trash"
            subtitle="items in your trash are deleted after 30 days"
          />
        </div>
      )}
      {!test && <div className="line"></div>}
      {!test && (
        <MenuItem
          img="../../../icons/report.png"
          title="Report post"
          subtitle="i'm concerned about this post"
        />
      )}
    </ul>
  );
}
