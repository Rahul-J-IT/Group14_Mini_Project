import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './user/profile/profile.module';

@Module({
  imports: [AuthModule, UserModule, ProfileModule, ConfigModule.forRoot({ isGlobal: true })],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
