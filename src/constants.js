const ReqIntents = {
  INTENT_REQ_USERS_DATA: 0x3,
  INTENT_REQ_INSERT_FACE_DATA: 0x4,
  INTENT_REQ_DELETE_FACE_DATA: 0x5,
  INTENT_REQ_ALL_FACES_DATA: 0x6,
  INTENT_REQ_NEWLY_INSERTED_FACES_DATA: 0x7,
  INTENT_REQ_UPDATE_FACES_DATA: 0x8,
  INTENT_REQ_UPDATE_ATTENDING_DATA: 0x10
};

const Addresses = {
  REP_BIND_ADDRESS: 'tcp://*:5556',
  REQ_CONNECT_ADDRESS: 'tcp://localhost:5555'
};

module.exports = { ReqIntents, Addresses };
