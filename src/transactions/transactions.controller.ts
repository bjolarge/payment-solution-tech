import { Controller, UseGuards, Param, Delete, Get, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import UsersService  from '../user/user.service';
import {AuthGuard} from '../auth/guard/auth.guard';
import { Transactions } from './entities/transactions.entity';
import { Request } from 'express';
import  {GetUser} from '../auth/decorators/get-user.decorator';
@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionService: TransactionsService,
    private userService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('user')
  async getUserTransactions(
    @GetUser() user: any,
  ): Promise<Transactions[] | string> {
    return await this.transactionService.viewUserTransactions({
      where: { user: { id: user.userId } },
    });
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async deleteUserTransaction(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<string> {
    await this.transactionService.deleteUserTransaction(id);
    return 'transaction deleted successfully';
  }
}