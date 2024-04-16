import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configOptions } from "./config/service.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import { ConfirmationModule } from "./confirmation/confirmation.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { UserRoleModule } from "./userRole/userRole.module";
import { MulterModule } from "@nestjs/platform-express";
import { extname } from 'path';
import { diskStorage } from "multer";
import { multerConfig } from "./config/multer.config";
import { FileModule } from "./file/file.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfirmationModule,
    UserRoleModule,
    FileModule,
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => typeOrmConfig(
        configService.get<string>('DATABASE_HOST'),
        configService.get<number>('DATABASE_PORT'),
        configService.get<string>('DATABASE_USERNAME'),
        configService.get<string>('DATABASE_PASSWORD'),
        configService.get<string>('DATABASE'),
        configService.get<boolean>('DATABASE_SYNCHRONIZE')
      ),
      inject: [ConfigService]
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: configService.get<string>('EMAIL_TRANSPORT'),
        defaults: {
          from: configService.get<string>('EMAIL_FROM'),
        },
        template: {
          dir: __dirname + '/templates',
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService]
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
