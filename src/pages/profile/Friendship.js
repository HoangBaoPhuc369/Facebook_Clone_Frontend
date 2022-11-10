import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import { useSelector } from "react-redux";
// import {
//   acceptRequest,
//   addFriend,
//   cancelRequest,
//   deleteRequest,
//   follow,
//   unfollow,
//   unfriend,
// } from "../../functions/user";
import { useDispatch } from "react-redux";
import {
  acceptRequest,
  addFriend,
  cancelRequest,
  deleteRequest,
  follow,
  unFollow,
  unfriend,
} from "../../redux/features/profileSlice";
export default function Friendship({ friendshipp, profileId }) {
  // const [friendship, setFriendship] = useState(friendshipp);

  // useEffect(() => {
  //   setFriendship(friendshipp);
  // }, [friendshipp]);

  const dispatch = useDispatch();
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);
  const menu = useRef(null);
  const menu1 = useRef(null);
  useClickOutside(menu, () => setFriendsMenu(false));
  useClickOutside(menu1, () => setRespondMenu(false));
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { profile } = useSelector((state) => ({ ...state.profile }));
  const addFriendHandler = () => {
    // setFriendship({ ...friendship, requestSent: true, following: true });
    // await addFriend(profileid, user.token);
    dispatch(addFriend({ profileId: profileId, token: user.token }));
  };
  const cancelRequestHandler = () => {
    // setFriendship({ ...friendship, requestSent: false, following: false });
    // await cancelRequest(profileid, user.token);

    dispatch(cancelRequest({ profileId: profileId, token: user.token }));
  };
  const followHandler = async () => {
    // setFriendship({ ...friendship, following: true });
    // await follow(profileid, user.token);

    dispatch(follow({ profileId: profileId, token: user.token }));
  };
  const unFollowHandler = async () => {
    // setFriendship({ ...friendship, following: false });
    // await unfollow(profileid, user.token);
    dispatch(unFollow({ profileId: profileId, token: user.token }));
  };
  const acceptRequestHandler = async () => {
    // setFriendship({
    //   ...friendship,
    //   friends: true,
    //   following: true,
    //   requestSent: false,
    //   requestReceived: false,
    // });
    // await acceptRequest(profileid, user.token);
    dispatch(acceptRequest({ profileId: profileId, token: user.token }));
  };
  const unfriendHandler = async () => {
    // setFriendship({
    //   ...friendship,
    //   friends: false,
    //   following: false,
    //   requestSent: false,
    //   requestReceived: false,
    // });
    // await unfriend(profileid, user.token);
    dispatch(unfriend({ profileId: profileId, token: user.token }));
  };
  const deleteRequestHandler = async () => {
    // setFriendship({
    //   ...friendship,
    //   friends: false,
    //   following: false,
    //   requestSent: false,
    //   requestReceived: false,
    // });
    // await deleteRequest(profileid, user.token);
    dispatch(deleteRequest({ profileId: profileId, token: user.token }));
  };

  return (
    <div className="friendship">
      {profile.friendship?.friends ? (
        <div className="friends_menu_wrap">
          <button className="gray_btn" onClick={() => setFriendsMenu(true)}>
            <img src="../../../icons/friends.png" alt="" />
            <span>Friends</span>
          </button>
          {friendsMenu && (
            <div className="open_cover_menu" ref={menu}>
              <div className="open_cover_menu_item hover1">
                <img src="../../../icons/favoritesOutline.png" alt="" />
                Favorites
              </div>
              <div className="open_cover_menu_item hover1">
                <img src="../../../icons/editFriends.png" alt="" />
                Edit Friend list
              </div>
              {profile.friendship?.following ? (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => unFollowHandler()}
                >
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  UnFollow
                </div>
              ) : (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => followHandler()}
                >
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Follow
                </div>
              )}
              <div
                className="open_cover_menu_item hover1"
                onClick={() => unfriendHandler()}
              >
                <i className="unfriend_outlined_icon"></i>
                UnFriend
              </div>
            </div>
          )}
        </div>
      ) : (
        !profile.friendship?.requestSent &&
        !profile.friendship?.requestReceived && (
          <button className="blue_btn" onClick={() => addFriendHandler()}>
            <img src="../../../icons/addFriend.png" alt="" className="invert" />
            <span>Add Friend</span>
          </button>
        )
      )}
      {profile.friendship?.requestSent ? (
        <button className="blue_btn" onClick={() => cancelRequestHandler()}>
          <img
            src="../../../icons/cancelRequest.png"
            className="invert"
            alt=""
          />
          <span>Cancel Request</span>
        </button>
      ) : (
        profile.friendship?.requestReceived && (
          <div className="friends_menu_wrap">
            <button className="gray_btn" onClick={() => setRespondMenu(true)}>
              <img src="../../../icons/friends.png" alt="" />
              <span>Respond</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu" ref={menu1}>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => acceptRequestHandler()}
                >
                  Confirm
                </div>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => deleteRequestHandler()}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}
      <div className="flex">
        {profile.friendship?.following ? (
          <button className="gray_btn" onClick={() => unFollowHandler()}>
            <img src="../../../icons/follow.png" alt="" />
            <span>Following</span>
          </button>
        ) : (
          <button className="blue_btn" onClick={() => followHandler()}>
            <img src="../../../icons/follow.png" className="invert" alt="" />
            <span>Follow</span>
          </button>
        )}
        <button className={profile.friendship?.friends ? "blue_btn" : "gray_btn"}>
          <img
            src="../../../icons/message.png"
            className={profile.friendship?.friends ? "invert" : ""}
            alt=""
          />
          <span>Message</span>
        </button>
      </div>
    </div>
  );
}
