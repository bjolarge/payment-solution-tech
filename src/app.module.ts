import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
//import { AccountdetailsModule } from './accountdetails/accountdetails.module';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule} from '@nestjs/throttler';
import { ConfigService,ConfigModule } from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    // added the rate limit feature to prevent brute force attack
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10,
    }]),
  
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        }),
        inject: [ConfigService],
      }),
      MongooseModule.forRoot(`mongodb://127.0.0.1:27017/${process.env.JOE}`),
    EmailConfirmationModule, AuthModule, UserModule, EmailModule, TransactionsModule, WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
