import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@food-cost/shared/types';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserEntity } from '../entities/user.entity';

/**
 * RolesGuard: Restricts access to routes based on user role.
 * Staff users always have read-only access (AC3 - Story 1.2).
 * Must be used in combination with TenantGuard.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: UserEntity }>();
    const user = request.user;

    if (!user) {
      return false;
    }

    const hasRole = requiredRoles.includes(user.role as UserRole);
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}
