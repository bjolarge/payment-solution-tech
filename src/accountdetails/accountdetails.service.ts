// import { Injectable } from '@nestjs/common';
// import { CreateAccountdetailDto } from './dto/create-accountdetail.dto';
// import { UpdateAccountdetailDto } from './dto/update-accountdetail.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Accountdetail } from './entities/accountdetail.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class AccountdetailsService {
//   constructor( 
//     @InjectRepository(Accountdetail)
//   private readonly accountdetails:Repository<Accountdetail>,
//   //   @InjectRepository(BakerySupplies)
//   // private readonly bakerySupplies:Repository<BakerySupplies>,
//   ){}
//   async create(createAccountdetailDto: CreateAccountdetailDto) {
//     const createdAccount = await this.accountdetails.create(createAccountdetailDto)
//     return this.accountdetails.save(createdAccount,manageAccount);
//   }











  

//   findAll() {
//     return `This action returns all accountdetails`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} accountdetail`;
//   }

//   update(id: number, updateAccountdetailDto: UpdateAccountdetailDto) {
//     return `This action updates a #${id} accountdetail`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} accountdetail`;
//   }

//   private async manageAccount(credit:number, debit:number){
//     const balance = credit-debit
//     return balance
//    }
// }
// //   private async manageAccount(name:string):Promise<BakerySupplies>{
// //     const existingNord = await  this.bakerySupplies.findOne({where:{name}});
// //     if(existingNord){
// //       return existingNord;
// //     }
// //     return this.bakerySupplies.create({name});
// //    }
// // }
