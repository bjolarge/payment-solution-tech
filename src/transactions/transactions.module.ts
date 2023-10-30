import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [TypeOrmModule.forFeature([Transactions]), UserModule],
  exports: [TransactionsService],

})
export class TransactionsModule {}
