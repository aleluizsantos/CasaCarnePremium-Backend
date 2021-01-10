const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const app = express();

//Fazer com que a aplicação ousa tanto o protocolo http quanto socket
const server = require("http").Server(app);
const io = require("socket.io")(server);

let onlineClients = 0;

io.on("connection", function (socket) {
  onlineClients++;
  // on disconnected, unregister
  socket.on("disconnect", function () {
    onlineClients--;
    // delete onlineClients[socket.id];
    socket.broadcast.emit("onlineClients", onlineClients);
  });

  socket.broadcast.emit("onlineClients", onlineClients);
});

//Criar um middleware para interceptar as requisições e transmitir
//ao protocolo socket.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

//Referenciando os CONTROLLER repassando a app
//que é nossa aplicação index pega todas os nosso controller
//e coloca na aplicação
require("./app/controller/index")(app);

server.listen(process.env.PORT || 3333, function () {
  console.log("..::Servidor online::..");
});
