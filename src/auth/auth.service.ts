import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import  UserService  from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/registerdto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload  from './tokenPayload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';

@Injectable()
export class AuthService {
  emailRegex = this.configService.get('emailRegex');
  ENCRYPTION_KEY = Buffer.from(
    this.configService.get<string>('ENCRYPTION_KEY') as string,
    'hex',
  );
  secret = Buffer.from(this.configService.get<string>('RANDOM_IV'));
  randomIv = Buffer.from(
    crypto
      .createHash('sha256')
      .update(String(this.secret))
      .digest('base64')
      .substring(0, 16),
  );

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly usersService:UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
 
  public async register(registrationData:RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        //refreshToken,
        ...registrationData,
        password: hashedPassword,
      });
     
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      // if (error?.code === PostgresErrorCode.UniqueViolation) {
      //   throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
      // }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //logging
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
   
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
   // return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
   return [
    'Authentication=; HttpOnly; Path=/; Max-Age=0',
    'Refresh=; HttpOnly; Path=/; Max-Age=0'
  ];
  }
  //get cookies for logout
  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  //get cookie with JWT TOKEN
  public getCookieWithJwtAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
  }
 
  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return {
      cookie,
      token,
    };
  }

  //logic to see if refresh token matches
  async getById(id:number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
 
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  // for chat service
  
  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    if (payload.userId) {
      return this.usersService.getById(payload.userId);
    }
  }

  //card system
  async cardTokenization(obj: any) {
    try {
      const cipher = crypto.createCipheriv(
        algorithm,
        this.ENCRYPTION_KEY,
        this.randomIv,
      );
      let encrypted = cipher.update(obj, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (err: any) {
      console.error(err.message);
      throw new HttpException(err.message, 500);
    }
  }

  async cardDecryption(obj: string) {
    try {
      const decipher = crypto.createDecipheriv(
        algorithm,
        this.ENCRYPTION_KEY,
        this.randomIv,
      );
      let decrypted = decipher.update(obj, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      // console.log(decrypted);
      return decrypted;
    } catch (err: any) {
      console.error(err.message);
      throw new HttpException(err.message, 500);
    }
  }

}


