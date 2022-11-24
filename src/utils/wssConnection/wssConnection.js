import * as webRTCGroupCallHandler from "../webRTC/webRTCGroupCallHandler";
import * as webRTCHandler from '../webRTC/webRTCHandler';
import { store } from "./../../app/store";
import {
  setActiveUsers,
  setGroupCallRooms,
} from "../../redux/features/dashboardSlice";
import { io } from "socket.io-client";
import { setRoomSocketId } from "../../redux/features/callSlice";
const SERVER = "http://localhost:8901";

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
};

let socket;

export const connectWithWebSocket = () => {
  socket = io(SERVER, {
    transports: ["polling"],
  });

  socket.on("connection", () => {
    console.log("succesfully connected with wss server");
  });

  socket.on("broadcast", (data) => {
    handleBroadcastEvents(data);
  });

  socket.on('webRTC-candidate', (data) => {
    webRTCHandler.handleCandidate(data);
  });

  socket.on('group-call-join-request', (data) => {
    webRTCGroupCallHandler.connectToNewUser(data);
  });

  // listeners related with group call
};

export const sendWebRTCCandidate = (data) => {
  socket.emit('webRTC-candidate', data);
};

// emitting events to server related with group call
export const registerGroupCall = (data) => {
  socket.emit("group-call-register", data);
};

export const userWantsToJoinGroupCall = (data) => {
  console.log(data);
  socket.emit('group-call-join-request', data);
};
// emitting events related with group calls

export const handleBroadcastEvents = (data) => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter(
        (activeUser) => activeUser.socketId !== socket.id
      );
      store.dispatch(setActiveUsers(activeUsers));
      break;
    case broadcastEventTypes.GROUP_CALL_ROOMS:
      const groupCallRooms = data.groupCallRooms.filter(
        (room) => room.socketId !== socket.id
      );
      const hostRooms = data.groupCallRooms.find(
        (room) => room.socketId === socket.id
      );
      const activeGroupCallRoomId =
        webRTCGroupCallHandler.checkActiveGroupCall();

      if (activeGroupCallRoomId) {
        const room = groupCallRooms.find(
          (room) => room.roomId === activeGroupCallRoomId
        );
        if (!room) {
          webRTCGroupCallHandler.clearGroupData();
        }
      }
      store.dispatch(setGroupCallRooms(groupCallRooms));
      store.dispatch(setRoomSocketId(hostRooms.socketId));
      break;
    default:
      break;
  }
};
