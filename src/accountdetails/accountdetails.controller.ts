// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { AccountdetailsService } from './accountdetails.service';
// import { CreateAccountdetailDto } from './dto/create-accountdetail.dto';
// import { UpdateAccountdetailDto } from './dto/update-accountdetail.dto';

// @Controller('accountdetails')
// export class AccountdetailsController {
//   constructor(private readonly accountdetailsService: AccountdetailsService) {}

//   @Post()
//   create(@Body() createAccountdetailDto: CreateAccountdetailDto) {
//     return this.accountdetailsService.create(createAccountdetailDto);
//   }

//   @Get()
//   findAll() {
//     return this.accountdetailsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.accountdetailsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAccountdetailDto: UpdateAccountdetailDto) {
//     return this.accountdetailsService.update(+id, updateAccountdetailDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.accountdetailsService.remove(+id);
//   }
// }
