import { 
  Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Req, 
  Res,ClassSerializerInterceptor, UseInterceptors, HttpStatus,} from 
'@nestjs/common';
import { Request, Response} from 'express';
import { AuthService } from './auth.service';
import  UserService  from '../user/user.service';
import { RegisterDto } from './dto/registerdto';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';
import JwtAuthenticationGuard from './guard/jwt-authentication.guard';
import { LoginDto } from './dto/login.dto';
import JwtRefreshGuard from './guard/JwtRefreshGuard';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';
import { Login } from './interfaces/Login.interface';
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  
  constructor(
    private readonly authService: AuthService,
   private readonly userService: UserService,
   private readonly emailConfirmationService: EmailConfirmationService
    ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    //former flow

    // const user= this.authService.register(registrationData);
    // console.log('Errrornow');
    // return user;
    
    const user = await this.authService.register(registrationData);
    await this.emailConfirmationService.sendVerificationLink(registrationData.email);
    return user;
  }
 
  //real login with token feature
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const {
      cookie: refreshTokenCookie,
      token: refreshToken,
    } = this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return user;

    //going one

    // const user = request.user;
    // user.password = undefined;
    // return user;
  }

  //Log-out
  // @UseGuards(JwtAuthenticationGuard)
  // @Post('log-out') 
  // async logOut(@Req() request:RequestWithUser, @Res() response: Response) {
  //   response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  //   console.log("Successfully logout");
  //   return response.sendStatus(200);
  // }

  // @UseGuards(JwtAuthenticationGuard)
  // @Post('log-out')
  // @HttpCode(200)
  // async logOut(@Req() request: RequestWithUser) {
  //   await this.userService.removeRefreshToken(request.user.id);
  //   request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  // }

  //logout feature
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authService.getCookiesForLogOut(),
    );
  }


  //Login
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    console.log("Login")
    return user;
  }
  // handling the refresh token endpoint
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id);
 
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
  
}
