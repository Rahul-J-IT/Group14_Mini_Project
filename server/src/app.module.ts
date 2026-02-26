import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { InstructorsModule } from './instructors/instructors.module';

@Module({
  imports: [
    // Config — loads .env
    ConfigModule.forRoot({ isGlobal: true }),

    // MySQL via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', 'root'),
        database: config.get<string>('DB_NAME', 'learnhub'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production', // auto-create tables in dev
        logging: config.get<string>('NODE_ENV') === 'development',
        charset: 'utf8mb4',
      }),
    }),

    CoursesModule,
    CurriculumModule,
    TagsModule,
    CategoriesModule,
    InstructorsModule,
  ],
})
export class AppModule {}
