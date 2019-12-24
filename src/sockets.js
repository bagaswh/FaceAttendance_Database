const zmq = require('zeromq');
const { ReqIntents } = require('./constants');

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

  listen(cb) {
    if (typeof cb == 'function') {
      cb();
    }

    this.socket.on('message', (intent, messageBody) => {
      const intentCode = Buffer.from(intent).readUInt32BE();
      this._routeIntent(intentCode, messageBody);
    });
  }
}

class SocketServer extends Socket {
  constructor(address) {
    super('rep');
    this.socket.bindSync(address);
    console.log('address:', address);
  }
}

class SocketClient extends Socket {
  constructor(address) {
    super('req');
    this.socket.connect(address);
  }
}

module.exports = { Socket, SocketServer, SocketClient };
