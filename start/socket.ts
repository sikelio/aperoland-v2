import Ws from 'App/Services/Ws';
import { ChatUser, JoinRoomArgs, MessagePackage } from 'App/Interfaces/ChatBox';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Env from '@ioc:Adonis/Core/Env';

Ws.boot();

Ws.io.on('connection', (socket: Socket) => {
  socket.on('joinRoom', ({ room, token }: JoinRoomArgs) => {
    jwt.verify(token, Env.get('JWT_SECRET'), (err, decoded: any) => {
      if (err) {
        socket.emit('authError', 'Authentication failed');
        socket.disconnect();

        return;
      }

      const username = decoded.username;
      const user: ChatUser = Ws.userJoin(socket.id, username, room);

      socket.join(user.room);
      socket.on('chat message', (msg: MessagePackage) => {
        Ws.chatBox(socket, msg);
      });
    });
  });
});
