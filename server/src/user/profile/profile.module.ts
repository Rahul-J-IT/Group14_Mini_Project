import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserModule } from '../user.module';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule { }
