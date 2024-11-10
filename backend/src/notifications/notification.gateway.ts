import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';

//import { Socket } from '@nestjs/platform-socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server;

  private readonly connections = new Map<string, any>();

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message);
  }

  handleConnection(socket) {
    const userId = socket.handshake.query.userId;
    if (typeof userId == 'string') {
      this.connections.set(userId, socket);
    }
  }

  handleDisconnect(socket) {
    const userId = socket.handshake.query.userId as string;
    this.connections.delete(userId);
  }

  getConnection(userId: string) {
    return this.connections.get(userId);
  }

  getConnetions() {
    return this.connections;
  }
}

