require("express-async-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const errorHandler = require("./errors/handler");

const app = express();

//Fazer com que a aplicação ousa tanto o protocolo http quanto socket
const server = require("http").Server(app);
const io = require("socket.io")(server);

//Criar um middleware para interceptar as requisições e transmitir
//ao protocolo socket.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(errorHandler);
app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

//Referenciando os CONTROLLER repassando a app
//que é nossa aplicação index pega todas os nosso controller
//e coloca na aplicação
require("./app/controller/index")(app);

server.listen(process.env.PORT || 3333, function () {
  console.log("..::Servidor online::..");
});

let onlineClients = 0;

io.on("connection", function (socket) {
  socket.on("join", function (data) {
    onlineClients = onlineClients + 1;
    console.log(data);
    socket.join(data.user_id);
  });
  // on disconnected, unregister
  socket.on("disconnect", function () {
    onlineClients = onlineClients - 1;
    // delete onlineClients[socket.id];
  });

  socket.broadcast.emit("onlineClients", onlineClients);
});
