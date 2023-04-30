import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { NotificationsGateway } from './notification.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(
    notifiedUser: User,
    trigerredBy: User,
    notificationType: 'heartedMem' | 'newComment' | 'newFollow',
  ) {
    let notificationMessage;
    switch (notificationType) {
      case 'heartedMem':
        notificationMessage = `User ${trigerredBy.username} hearted your mem!`;
        break;
      case 'newComment':
        notificationMessage = `User ${trigerredBy.username} just made a comment on your mem!`;
        break;
      case 'newFollow':
        notificationMessage = `User ${trigerredBy.username} just followed you!`;
        break;
      default:
        throw new NotFoundException('Notification type unknown');
    }
    const newNotification = new Notification(notificationMessage);
    newNotification.notifiedUser = notifiedUser;
    await this.notificationRepository.save(newNotification);
    this.sendNotification(newNotification, notifiedUser.id, notificationType);
  }

  private async sendNotification(
    notification: Notification,
    userId: number,
    notificationType: 'heartedMem' | 'newComment' | 'newFollow',
  ) {
    const socket = this.notificationsGateway.getConnection(userId.toString());
    if (socket) {
      socket.emit(notificationType, notification);
    }
  }
}
