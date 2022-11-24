import * as webRTCHandler from '../webRTC/webRTCHandler';
import { store } from "./../../app/store";
import { getSocket, setActiveUsers } from "../../redux/features/dashboardSlice";

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
};


export const handleWSSCallInParent = (newSocket) => {
  // listeners related with direct call
  newSocket.on('call-other', (data) => {
    console.log(data);
    webRTCHandler.handlePreOfferInParent(data);
  });

};

export const handleBroadcastEvents = ({ data, socketRef, dispatch, user }) => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter(
        (activeUser) =>
          activeUser.socketId !== socketRef.current?.id &&
          user.following.some(u => u._id === activeUser.userId)
      );
      store.dispatch(setActiveUsers(activeUsers));
      break;
    default:
      break;
  }
};
