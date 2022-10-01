import { createContext, useContext, useState } from "react";
import {createPortal} from "react-dom";

const ChatBoxContext = createContext({});

const ChatProvider = ({ children }) => {
  const [chatBox, setChatBox] = useState(undefined);
  const showChatBox = (newChatBox) => setChatBox(newChatBox);
  const hideChatBox = () => setChatBox(undefined);
  return (
    <ChatBoxContext.Provider value={{showChatBox, hideChatBox }}>
      {children}
      {!!chatBox && createPortal(chatBox, document.body)}
    </ChatBoxContext.Provider>
  );
};

const useChatBox = () => useContext(ChatBoxContext);

export { ChatProvider, useChatBox };

export default ChatBoxContext;
