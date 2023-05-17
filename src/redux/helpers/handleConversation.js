export const handleCheck = (data) => {
  if (!data) return;
  switch (data?.type) {
    case "conversation":
      const checkConversation = data?.conversations?.find(
        (c) => c._id === data?.currentChatId
      );
      const indexConversation = data?.conversations?.findIndex(
        (c) => c._id === data?.currentChatId
      );

      return { checkConversation, indexConversation };
    case "message":
      const checkMessage = data?.conversation?.messages?.find(
        (c) => c._id === data?.messageId
      );
      const indexMessage = data?.conversation?.messages?.findIndex(
        (c) => c._id === data?.messageId
      );
      return { checkMessage, indexMessage };

    default:
      return;
  }
};

export const handleSetStatusMessage = (data) => {
  if (!data) return;
  const { checkConversation, indexConversation } = handleCheck({
    conversations: data?.conversations,
    currentChatId: data?.currentChatId,
    type: "conversation",
  });

  const { checkMessage, indexMessage } = handleCheck({
    conversation: checkConversation,
    messageId: data?.messageId,
    type: "message",
  });

  if (checkConversation && indexConversation > -1) {
    if (checkMessage && indexMessage > -1) {
      checkMessage.status = data?.status;
      checkConversation?.messages?.splice(indexMessage, 1, checkMessage);
      data?.conversations?.splice(indexConversation, 1, checkConversation);
    }
  }
};
