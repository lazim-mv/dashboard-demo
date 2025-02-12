import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    req: FastifyRequest,
    payload: {
      user: Awaited<ReturnType<AuthService['validateUser']>>;
      iat: number;
      exp: number;
    },
    res: any,
  ): Promise<
    Awaited<ReturnType<AuthService['validateUser']>> & { refreshToken: string }
  > {
    try {
      const refreshToken = req.headers.authorization
        ?.replace('Bearer', '')
        .trim();
      if (!refreshToken) throw new ForbiddenException();
      const userFromDb = await this.prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
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
          refresh_tokens: {
            where: {
              token: refreshToken,
            },
          },
        },
        where: {
          email: payload.user.email,
        },
      });

      //if refresh token associated with the user is not found in the db
      if (userFromDb.refresh_tokens.length === 0) {
        throw new ForbiddenException();
      }
      const user = {
        ...userFromDb,
        user_roles: userFromDb.user_roles.map((role) => role.role),
      };
      delete user.refresh_tokens;
      return {
        ...user,
        refreshToken,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
