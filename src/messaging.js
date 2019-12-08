const zmq = require('zeromq');
const { ReqIntents, Addresses } = require('./constants');
const { Face } = require('./model/face');
const { User } = require('./model/user');

class Socket {
  constructor(socketType) {
    this.socket = zmq.socket(socketType);

    this._initializeIntentHandlers();
  }

  send(intent, message) {
    this.socket.send(Buffer.from([intent]), zmq.ZMQ_SNDMORE);
    this.socket.send(message);
  }

  _initializeIntentHandlers() {
    this.intentHandlers = {};
    for (let val of Object.values(ReqIntents)) {
      this.intentHandlers[val] = [];
    }
  }

  _routeIntent(intent, messageBody) {
    if (intent in this.intentHandlers) {
      this.intentHandlers[intent].forEach(handler => {
        handler.call(this, this.socket, messageBody);
      });
    }
  }

  on(intentCode, handler) {
    if (typeof handler == 'function' && intentCode in this.intentHandlers) {
      this.intentHandlers[intentCode].push(handler);
    }
  }

  listen() {
    this.socket.on('message', (intent, messageBody) => {
      const intentCode = Buffer.from(intent).readUInt32BE();
      console.log(`Received message with intent code: ${intentCode}`);
      this._routeIntent(intentCode, messageBody);
    });
  }
}

class SocketServer extends Socket {
  constructor(address) {
    super('rep');
    this.socket.bindSync(address);
  }
}

class SocketClient extends Socket {
  constructor(address) {
    super('req');
    this.socket.connect(address);
  }
}

const socketClient = new SocketClient(Addresses.REQ_CONNECT_ADDRESS);
const socketServer = new SocketServer(Addresses.REP_BIND_ADDRESS);

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
