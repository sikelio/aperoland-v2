import { Server, Socket } from 'socket.io';
import AdonisServer from '@ioc:Adonis/Core/Server';
import { ChatUser, MessagePackage } from '../Interfaces/ChatBox';
import jwt from 'jsonwebtoken';
import Env from '@ioc:Adonis/Core/Env';

declare module 'socket.io' {
  interface Socket {
    userId?: number;
  }
}

class Ws {
  public io: Server;
  private booted: boolean = false;
  private users: ChatUser[] = [];

  public boot(): void {
    if (this.booted) {
      return
    }

    this.booted = true;
    this.io = new Server(AdonisServer.instance!, {
      cors: {
        origin: true,
        methods: ['GET', 'POST']
      }
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.query.token;

      jwt.verify(token as string, Env.get('JWT_SECRET'), (err, decoded) => {
        if (err || !decoded) {
          return next(new Error('Authentication error'));
        }

        if (typeof decoded === 'object' && 'id' in decoded) {
          socket.userId = decoded.id;

          next();
        } else {
          return next(new Error('Invalid token'));
        }
      });
    });
  }

  public userJoin(socketId: string, username: string, room: string): ChatUser {
    const user: ChatUser = { socketId, username, room };

    this.users.push(user);

    return user;
  }

  private getCurrentUser(id): ChatUser | undefined {
    return this.users.find(user => user.socketId == id);
  }

  public chatBox(socket: Socket, msg: MessagePackage) {
    const user: ChatUser | undefined = this.getCurrentUser(socket.id);

    return this.io.to(user!.room).emit('chat message', {
      username: user!.username,
      message: msg.msg
    });
  }
}

export default new Ws();
