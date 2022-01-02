import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { environments } from './environments';
import { PostsModule } from './posts/posts.module';
import { DatabaseModule } from './database/database.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
    }),
    PostsModule,
    DatabaseModule,
    UploadsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
