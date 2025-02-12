import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import FastifyMultipart from '@fastify/multipart';

type RequestUserType =
  | Awaited<ReturnType<AuthService['validateUser']>>
  | undefined;

declare module 'fastify' {
  export interface FastifyRequest {
    user: RequestUserType; //& { refreshToken: string | undefined };
  }
}

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.enableCors({
    origin: process.env.FRONTEND_URL,
  });
  app.register(FastifyMultipart);
  await app.listen(3000);
}
bootstrap();
