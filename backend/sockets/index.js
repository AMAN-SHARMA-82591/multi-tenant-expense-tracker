export default function socketHandler(io) {
  let userData;
  io.on("connection", (socket) => {
    console.log("working connection");

    socket.on("setup", (user) => {
      console.log("user", user);
      userData = user;
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
}
