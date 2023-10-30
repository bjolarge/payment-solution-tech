import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';


const algorithm = 'aes-256-cbc';


@Injectable()
export default class UserService {
  // private configService:ConfigService;
  // emailRegex = this.configService.get('emailRegex');
  // ENCRYPTION_KEY = Buffer.from(
  //   this.configService.get<string>('ENCRYPTION_KEY') as string,
  //   'hex',
  // );
  // secret = Buffer.from(this.configService.get<string>('RANDOM_IV'));
  // randomIv = Buffer.from(
  //   crypto
  //     .createHash('sha256')
  //     .update(String(this.secret))
  //     .digest('base64')
  //     .substring(0, 16),
  // );
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private configService: ConfigService,

  ) {}

  // this handles the refresh feature
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken
    });
  }
  // this handles the refreshtoken
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
      
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
  //this allows us to sum up the total number of app user 
  async findusercount(){
    const usercount = await this.usersRepository.count();
    return usercount;
  }

  //remove refreshtoken
  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  //create user with Google Oauth
  async createWithGoogle(email: string, name: string) {
    const newUser = await this.usersRepository.create({
      email,
      name,
      isRegisteredWithGoogle: true,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  //email confirmation
  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update({ email }, {
      isEmailConfirmed: true
    });
  }

  //get userById
  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserById(id:number){
    const user = await this.usersRepository.count();
  }


  //get user if refreshToken
  
//close refreshToken
  async getByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({email});
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }
 
  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

}
