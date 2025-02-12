import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const AuthUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    if (!user) {
      console.warn(
        'ERROR: ADD JWT AUTH GUARD TO THE CONROLLER FUNCTION IN WHICH THIS DECORATOR IS USED.',
      );
      throw new InternalServerErrorException();
    }
    return user;
  },
);
