import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './role.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) {
      //authentication failed
      return false;
    }
    const user = context.switchToHttp().getRequest().user;
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

