import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server;

  private readonly connections = new Map<string, Socket>();

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message);
  }

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId;
    if (typeof userId == 'string') {
      this.connections.set(userId, socket);
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    this.connections.delete(userId);
  }

  getConnection(userId: string): Socket | undefined {
    return this.connections.get(userId);
  }

  getConnetions() {
    return this.connections;
  }
}

