import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTReqUser } from 'src/types';

@Controller('/notification')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getNotifications(@Request() req: JWTReqUser) {
    return await this.notificationService.getNotifications(req.user.userId);
  }
}
