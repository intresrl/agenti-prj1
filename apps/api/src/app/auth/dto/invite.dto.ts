import { IsEmail, IsString, MinLength } from 'class-validator';

export class InviteDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  name!: string;
}
