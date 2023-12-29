export interface ChatUser {
  socketId: string,
  username: string,
  room: string
}

export interface JoinRoomArgs {
  room: string,
  token: string
}

export interface MessagePackage {
  username: string,
  msg: string | string[]
}
