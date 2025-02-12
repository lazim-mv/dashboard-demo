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
      // Extract refresh token from Authorization header
      const refreshToken = req.headers.authorization
        ?.replace('Bearer', '')
        .trim();

      // Fetch user from database
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
        },
        where: {
          email: payload.user.email,
        },
      });

      // Convert roles structure
      const user = {
        ...userFromDb,
        user_roles: userFromDb.user_roles.map((role) => role.role),
      };

      return {
        ...user,
        refreshToken: refreshToken || '',
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

}
