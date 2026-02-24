import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../entities/user.entity';

/**
 * TenantGuard: Extends JWT AuthGuard to also enforce tenant isolation.
 * Ensures request.user exists and that the tenantId in the JWT matches the user record.
 * Apply this guard on all API endpoints requiring authentication (AC2 - Story 1.2).
 */
@Injectable()
export class TenantGuard extends AuthGuard('jwt') implements CanActivate {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    // First validate JWT via passport
    const isValid = await super.canActivate(context);
    if (!isValid) return false;

    const request = context.switchToHttp().getRequest<{ user: UserEntity }>();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is not active');
    }

    return true;
  }
}
