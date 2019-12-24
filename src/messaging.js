const { Socket, SocketClient, SocketServer } = require('./sockets');
const { ReqIntents } = require('./constants');
const { Face } = require('./model/face');
const { User } = require('./model/user');

const socketClient = new SocketClient(process.env.REQ_CONNECT_ADDRESS);
const socketServer = new SocketServer(process.env.REP_BIND_ADDRESS);

socketServer.on(ReqIntents.INTENT_REQ_ALL_FACES_DATA, async (socket, message) => {
  socket.send(JSON.stringify(await Face.getAll()));
});

socketServer.on(ReqIntents.INTENT_REQ_USERS_DATA, async (socket, message) => {
  socket.send(JSON.stringify(await User.getAll()));
});

socketServer.on(ReqIntents.INTENT_REQ_UPDATE_ATTENDING_DATA, async (socket, message) => {
  const string = Buffer.from(message).toString();
  const json = JSON.parse(string);

  for (let id of json.ids) {
    User.updateAttendance(id, User.getCurrentAttendanceTableName(), true);
  }

  socket.send(0x0);
});

socketServer.on(ReqIntents.INTENT_REQ_INSERT_FACE_DATA, async (socket, message) => {
  const json = Buffer.from(message).toString();
  const faceData = JSON.parse(json);

  socketClient.send(ReqIntents.INTENT_REQ_UPDATE_FACES_DATA, JSON.stringify([faceData]));

  await Face.insert(faceData);
  socket.send(0x0);
});

module.exports = { socketServer, socketClient };
