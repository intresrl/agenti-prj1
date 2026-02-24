import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TenantEntity } from './entities/tenant.entity';
import { UserEntity } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InviteDto } from './dto/invite.dto';
import { UserRole, AuthResponse } from '@food-cost/shared/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Register a new Tenant + Admin User (AC1 - Story 1.2)
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Create Tenant
    const tenant = this.tenantRepository.create({ name: dto.restaurantName });
    await this.tenantRepository.save(tenant);

    // Create Admin User
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepository.create({
      tenantId: tenant.id,
      email: dto.email,
      name: dto.adminName,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    });
    await this.userRepository.save(user);

    return this.buildAuthResponse(user, tenant);
  }

  /**
   * Authenticate a user and return JWT (AC2 - Story 1.2)
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['tenant'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tenant = await this.tenantRepository.findOneOrFail({
      where: { id: user.tenantId },
    });

    return this.buildAuthResponse(user, tenant);
  }

  /**
   * Invite a staff user to the current tenant (AC3 - Story 1.2)
   */
  async inviteStaff(dto: InviteDto, adminUser: UserEntity): Promise<{ inviteToken: string }> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const inviteToken = uuidv4();
    const user = this.userRepository.create({
      tenantId: adminUser.tenantId,
      email: dto.email,
      name: dto.name,
      passwordHash: '', // Will be set when invite is accepted
      role: UserRole.STAFF,
      inviteToken,
      isActive: false,
    });
    await this.userRepository.save(user);

    return { inviteToken };
  }

  /**
   * Accept an invite and set password to activate the Staff account (AC3 - Story 1.2)
   */
  async acceptInvite(inviteToken: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({
      where: { inviteToken },
    });

    if (!user) {
      throw new NotFoundException('Invite token not found or already used');
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.isActive = true;
    user.inviteToken = null;
    await this.userRepository.save(user);

    const tenant = await this.tenantRepository.findOneOrFail({
      where: { id: user.tenantId },
    });

    return this.buildAuthResponse(user, tenant);
  }

  private buildAuthResponse(user: UserEntity, tenant: TenantEntity): AuthResponse {
    const payload = { sub: user.id, tenantId: user.tenantId, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
    };
  }
}
