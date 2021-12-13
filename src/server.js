require("express-async-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const errorHandler = require("./errors/handler");
const app = express();

const PORT = process.env.PORT || 4000;

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

server.listen(PORT, function () {
  console.log(`[servidor] online in Port ${PORT}`);
});

let clients = [];
io.on("connection", function (socket) {
  !clients.includes(socket.id) && clients.push(socket.id);
  // socket.on("join", function (data) {
  //   !clients.includes(socket.id) && clients.push(socket.id);
  //   socket.join(data.user_id);
  // });
  socket.on("disconnect", function () {
    clients = clients.filter((item) => item !== socket.id);
    socket.broadcast.emit("onlineClients", clients.length);
  });

  socket.broadcast.emit("onlineClients", clients.length);
});
