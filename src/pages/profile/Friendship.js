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
  addFriend,
  cancelRequest,
  deleteRequest,
  follow,
  unFollow,
  unfriend,
  updateProfile,
} from "../../redux/features/profileSlice";
import { getConversations } from "../../redux/features/conversationSlice";
import * as api from "../../redux/api";
import { updateFriends } from "../../redux/features/authSlice";

export default function Friendship({ profileId }) {
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
    dispatch(addFriend({ profileId: profileId, token: user.token }));
  };
  const cancelRequestHandler = () => {
    dispatch(
      cancelRequest({
        profileId: profileId,
        userName: profile?.username,
        token: user.token,
      })
    );
  };
  const followHandler = async () => {
    dispatch(follow({ profileId: profileId, token: user.token }));
  };
  const unFollowHandler = async () => {
    dispatch(unFollow({ profileId: profileId, token: user.token }));
  };
  const acceptRequestHandler = async () => {
    try {
      const res = await api.acceptRequest(profileId, user.token);
      if (res.data) {
        dispatch(
          updateProfile({
            userName: profile?.username,
            token: user.token,
          })
        );

        dispatch(updateFriends(res.data.friends));

        dispatch(getConversations({ userToken: user?.token }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const unfriendHandler = async () => {
    await dispatch(
      unfriend({
        profileId: profileId,
        userName: profile?.username,
        token: user.token,
      })
    );

    await dispatch(getConversations({ userToken: user?.token }));
  };

  const deleteRequestHandler = async () => {
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
              {profile.friendship?.friends ? (
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
                  onClick={() => {
                    acceptRequestHandler();
                  }}
                >
                  Confirm
                </div>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => {
                    deleteRequestHandler();
                    dispatch(
                      updateProfile({
                        userName: profile?.username,
                        token: user?.token,
                      })
                    );
                  }}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}
      <div className="flex flex-wrap content-center gap-2">
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
        <button
          className={profile.friendship?.friends ? "blue_btn" : "gray_btn"}
        >
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
