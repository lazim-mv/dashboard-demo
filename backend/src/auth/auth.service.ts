import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async signUp(signUpDto: SignUpDto) {
    try {
      const data = {
        name: signUpDto.name,
        email: signUpDto.email,
        password: await bcrypt.hash(signUpDto.password, 10),
        parent_role: signUpDto.parent_role,
      };
      await this.prisma.user.create({
        data: data,
      });
      return { message: 'Sign up successfull.' };
    } catch (err) {
      console.log(err);
      // if (err instanceof PrismaClientKnownRequestError) {
      //   if (err.code === 'P2002') {
      //     throw new ConflictException(
      //       'Email already in use, try to use another one.',
      //     );
      //   }
      // }
      throw new InternalServerErrorException(
        'Sign up failed. Something went wrong try again.',
      );
    }
  }

  async validateUser(email: string, password: string) {
    const userFromDb = await this.prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        parent_role: true,
        partner_id: true,
        user_roles: {
          select: {
            role: {
              select: {
                name: true,
                permissions: {
                  select: { resource: true, actions: true, type: true },
                },
              },
            },
          },
        },
      },
      where: {
        email,
      },
    });

    if (!userFromDb) throw new UnauthorizedException('User does not exist.');
    const user = {
      ...userFromDb,
      user_roles: userFromDb.user_roles.map((role) => role.role),
    };
    const passCorrect = await bcrypt.compare(password, user.password);
    if (!passCorrect) throw new UnauthorizedException('Password Incorrect');
    delete user.password;
    return user as Omit<typeof user, 'password'>;
  }

  async addRefreshTokenToUser(
    token: string,
    user_id: number,
    prevToken: string = '',
  ) {
    try {
      const res = await this.prisma.refreshToken.upsert({
        where: {
          token_user_id: {
            user_id,
            token: prevToken,
          },
        },
        create: {
          user_id,
          token,
        },
        update: {
          user_id,
          token,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException('Failed token generation.');
    }
  }

  async getScreens(partnerId: number, userId: number) {
    if (!partnerId) return null;
    const user = await this.prisma.user.findUnique({
      select: {
        user_roles: {
          select: {
            role: {
              select: {
                screens: {
                  include: {
                    sub_screens: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: userId,
      },
    });
    return user.user_roles?.[0]?.role?.screens;
  }

  async login(payload: { user: FastifyRequest['user'] }) {
    const accessTokenPromise = this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: `${10 * 60}s`, //10minutes
    });
    const refreshTokenPromise = this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '10d', //10days
    });

    const [accessToken, refreshToken] = await Promise.allSettled([
      accessTokenPromise,
      refreshTokenPromise,
    ]);
    if (
      accessToken.status === 'rejected' ||
      refreshToken.status === 'rejected'
    ) {
      throw new InternalServerErrorException('Failed to login, try again.');
    }

    await this.addRefreshTokenToUser(refreshToken.value, payload.user.id);
    const screens = await this.getScreens(
      payload.user.partner_id,
      payload.user.id,
    );

    return {
      access_token: accessToken.value,
      refresh_token: refreshToken.value,
      screens,
    };
  }

  async refresh(payload: {
    user: FastifyRequest['user'] & { refreshToken: string };
  }) {
    const prevRefreshToken = payload.user.refreshToken;
    delete payload.user.refreshToken;

    const accessTokenPromise = this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: `${10 * 60}s`, //10minutes
    });
    const refreshTokenPromise = this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '10d', //10days
    });

    const [accessToken, refreshToken] = await Promise.allSettled([
      accessTokenPromise,
      refreshTokenPromise,
    ]);
    if (
      accessToken.status === 'rejected' ||
      refreshToken.status === 'rejected'
    ) {
      throw new InternalServerErrorException('Failed to login, try again.');
    }

    await this.addRefreshTokenToUser(
      refreshToken.value,
      payload.user.id,
      prevRefreshToken,
    );
    const screens = await this.getScreens(
      payload.user.partner_id,
      payload.user.id,
    );

    return {
      access_token: accessToken.value,
      refresh_token: refreshToken.value,
      screens,
    };
  }

  // async profile(id: number) {
  //   return this.prisma.user.findUnique({ where: { id } });
  // }
}
