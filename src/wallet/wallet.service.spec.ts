import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> =>({
findOne: jest.fn(),
create: jest.fn(),
});

describe('WalletService', () => {
  let service: WalletService;
  let walletRepository:MockRepository;


  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [WalletService],
  //   }).compile();

  //   service = module.get<WalletService>(WalletService);
  // });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService, 
      {provide:getRepositoryToken(Wallet), useValue: createMockRepository()}],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletRepository = module.get<MockRepository>(getRepositoryToken(Wallet));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

   // this would handle the findOne endpoint
   describe('expectedWallet', ()=>{
    describe('when wallet exisits',()=>{
      it('Should return the wallet', async()=>{
       // const amount = '1';
        const expectedWallet={};
    
    walletRepository.find.mockReturnValue(expectedWallet);
    const wallet = await service.getAllWallets();
    expect(wallet).toEqual(expectedWallet);
      });
    });
    describe('otherwise',()=>{
      it('Should throw the "NotFoundException"', async()=>{
       // const walletId = '1';
        walletRepository.find.mockReturnValue(undefined);
    
        try {
          await service.getAllWallets();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Loaf with #${Wallet} not found`);
        }
      });
    })
      });
});
