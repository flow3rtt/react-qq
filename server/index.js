const Koa = require("koa");
const CryptoJS = require("crypto-js");
const bodyParser = require("koa-bodyparser");
const router = require("./router");
const jwt = require("koa-jwt");
const _socket = require("socket.io");
const path = require("path");
const socketController = require("./controller/socket");
const authMiddleware = require("./middleware/auth");
const staticMiddleware = require("./middleware/static");

const http = require("http");

const secret = CryptoJS.AES.encrypt("jwt_secert", "_+qq+_") + "";
global.secret = secret;

const app = new Koa();

app.use(staticMiddleware(path.join(__dirname, "./static")));
app.use(bodyParser());

app.use(authMiddleware());

app.use(
  jwt({
    secret
  }).unless({
    path: [
      /\/api\/v1\/register/,
      /\/api\/v1\/login/,
      /\/api\/v1\/validateCode/,
      /\/api\/v1\/checkPhone/
    ]
  })
);

app.use(router.routes()).use(router.allowedMethods());

const server = http.createServer(app.callback());
const io = _socket(server);

io.on("connection", socket => {
  socket.on("login", id => {
    socketController.login(id, socket.id);
  });
  socket.on("sendPrivateMessage", async payload => {
    const { toId } = payload;
    const socketId = await socketController.getSocketId(toId);
    if (!!socketId) {
      io.to(socketId).emit("receivePrivateMessage", payload);
    }
    await socketController.saveMessage(payload,'private');
  });
  socket.on("sendGroupMessage", async payload => {
    const { toId, id } = payload;
    const socketIds = await socketController.getSocketIds(id, toId);
    socketIds.forEach(v => {
      io.to(v).emit("receiveGroupMessage", payload);
    });
    await socketController.saveMessage(payload,'group');
  });
});
server.listen(8082, () => {
  console.log("server start...");
});
