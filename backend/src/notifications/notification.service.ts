import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { NotificationsGateway } from './notification.gateway';
import { Mem } from 'src/mem/mem.entity';
import { S3Service } from 'src/s3/s3.service';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly notificationsGateway: NotificationsGateway,
    private s3Service: S3Service,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createNotification(
    notifiedUser: User,
    trigerredBy: User,
    relatesTo: Mem | undefined,
    notificationType:
      | 'unheartedMem'
      | 'heartedMem'
      | 'newComment'
      | 'newFollow',
  ) {
    let notificationMessage;
    switch (notificationType) {
      case 'unheartedMem':
        notificationMessage = `User ${trigerredBy.username} unhearted your mem!`;
        break;
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
    newNotification.trigerredBy = trigerredBy;
    if (relatesTo) newNotification.relatesTo = relatesTo;
    await this.notificationRepository.save(newNotification);
    this.sendNotification(newNotification, notifiedUser.id, notificationType);
  }

  private async sendNotification(
    notification: Notification,
    userId: number,
    notificationType:
      | 'unheartedMem'
      | 'heartedMem'
      | 'newComment'
      | 'newFollow',
  ) {
    const socket = this.notificationsGateway.getConnection(userId.toString());
    if (socket) {
      socket.emit(notificationType, notification);
    }
  }

  async getNotifications(userId: number) {
    const notifs = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.notifiedUserId = :id', { id: userId })
      .leftJoinAndSelect('notification.trigerredBy', 'trigerredBy')
      .getMany();

    const notificationsDto = await Promise.all(
      notifs.map(async (notification) => {
        if (notification.trigerredBy.avatarImageKey) {
          notification.trigerredBy.avatarImageUrl =
            await this.s3Service.retrieveImage(
              notification.trigerredBy.avatarImageKey,
            );
        }
        notification.formattedCreatedDate = new Intl.DateTimeFormat('cs-CZ', {
          day: 'numeric',
          month: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(notification.createdDate);
        return { ...notification };
      }),
    );

    notifs.forEach((notification) => {
      if (!notification.seen) {
        this.removeNotificationTimeout(notification);
        notification.seen = true;
        this.notificationRepository.save(notification);
      }
    });

    return notificationsDto;
  }

  //86 400 000 is a day xd
  //currently set to 30 minutes
  removeNotificationTimeout(notification: Notification) {
    return setTimeout(() => this.removeNotification(notification), 1800000);
  }

  removeNotification(notification: Notification) {
    this.notificationRepository.remove(notification);
  }
}

