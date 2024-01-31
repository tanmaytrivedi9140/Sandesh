export const getSender = (logged , users) =>{
    return users[0]._id === logged._id ? users[1].name : users[0].name;
}
export const getSenderFull = (logged, users) => {
  return users[0]._id === logged._id ? users[1] : users[0];
};


export const samesender = (messages , message , i , id) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== message.sender._id ||
      messages[i + 1].sender._id !== undefined) && (
        messages[i].sender._id !== id
      )
  );
}
export const isLastMessage = (messages, i, id) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== id &&
    messages[messages.length - 1].sender._id
  );
};
export const isSameSenderMargin = (messages, m, i, userId) => {

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};