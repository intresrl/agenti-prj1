import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InviteDto } from './dto/invite.dto';
import { TenantGuard } from './guards/tenant.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { UserRole, AuthResponse } from '@food-cost/shared/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Creates a new Tenant and Admin User (AC1 - Story 1.2)
   */
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   * Returns JWT for valid credentials
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  /**
   * POST /auth/invite
   * Admin only — invites a staff member to the same tenant (AC3 - Story 1.2)
   */
  @Post('invite')
  @UseGuards(TenantGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async invite(
    @Body() dto: InviteDto,
    @CurrentUser() user: UserEntity
  ): Promise<{ inviteToken: string }> {
    return this.authService.inviteStaff(dto, user);
  }

  /**
   * POST /auth/accept-invite/:token
   * Staff user accepts invite and sets their password
   */
  @Post('accept-invite/:token')
  async acceptInvite(
    @Param('token') token: string,
    @Body('password') password: string
  ): Promise<AuthResponse> {
    return this.authService.acceptInvite(token, password);
  }
}
