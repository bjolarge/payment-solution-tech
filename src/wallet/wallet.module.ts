import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { UserModule } from '../user/user.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    UserModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports:[WalletService]
})
export class WalletModule {}
