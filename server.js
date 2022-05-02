const http = require("http");
const app = require("./app/app");
const socketio = require("socket.io");

const port = 3000;

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// const host = "http://67.43.234.92/"
const host = "http://localhost";
server.listen(port, () => {
  console.log(`Api server is running on: ${host}:${port}`);

  io.on("connection", (socket) => {
    console.log("new socket connection has been made");

    socket.on("takeAction", (data) => {
      const { action, time } = data;
      console.log(action);

      if (action === "play") {
        io.emit("doPlay");
      } else if (action === "pause") {
        io.emit("doPause", time);
      } else if (action === "reset") {
        io.emit("doReset");
      }
    });
  });
});
