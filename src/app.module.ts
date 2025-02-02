import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';


// Load environment variables
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost', // Default to 'localhost' if not provided
      port: +process.env.DB_PORT! || 3306, // Add fallback to 3306 if not set or undefined
      username: process.env.DB_USERNAME || 'root', // Default to 'root' if not provided
      password: process.env.DB_PASSWORD || '', // Default to empty password if not provided
      database: process.env.DB_NAME || 'vendormanagedb', // Default to 'vendormanagedb' if not provided
      autoLoadEntities: true,
      entities: [User, Role],
      synchronize: true, // Set to false in production
    }),
    UsersModule,
    RolesModule,
    AuthModule
  ],
})
export class AppModule {}
