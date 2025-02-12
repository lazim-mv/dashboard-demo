import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    user: Awaited<ReturnType<AuthService['validateUser']>>;
  }) {
    console.log(payload.user);
    const user = payload.user;
    // user.user_roles.push({
    //   name: 'test',
    //   permissions: [
    //     {
    //       type: 'NORMAL',
    //       resource: 'STUDENTS',
    //       actions: ['READ', 'WRITE'],
    //     },
    //     {
    //       type: 'NORMAL',
    //       resource: 'PARTNERS',
    //       actions: ['READ'],
    //     },
    //     {
    //       type: 'NORMAL',
    //       resource: 'DASHBOARD',
    //       actions: ['READ'],
    //     },
    //   ],
    // });
    return user;
  }
}
