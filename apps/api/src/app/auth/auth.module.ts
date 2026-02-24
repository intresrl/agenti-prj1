import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TenantEntity } from './entities/tenant.entity';
import { UserEntity } from './entities/user.entity';
import { TenantGuard } from './guards/tenant.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env['JWT_SECRET'] || 'change-me-in-production',
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([TenantEntity, UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TenantGuard, RolesGuard],
  exports: [TenantGuard, RolesGuard, JwtModule, PassportModule],
})
export class AuthModule {}
