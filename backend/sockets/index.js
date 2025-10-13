import MessageModel from "../model/Message.model.js";

export default function socketHandler(io) {
  let userData;
  io.on("connection", (socket) => {
    console.log("Socket connection successfully established.");

    socket.on("setup", (user) => {
      console.log("user", user);
      userData = user;
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
    });
    socket.on("sendMessage", async (message) => {
      // message.conversation is the room ID
      const messageData = await MessageModel.create({
        ...message,
        conversation: message.conversationId,
      });
      io.to(message.conversationId).emit("message", { message: messageData });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
}
