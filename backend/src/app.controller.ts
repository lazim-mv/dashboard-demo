import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { FastifyRequest } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: FastifyRequest, @Query() query: any): string {
    console.log(req.body);
    console.log(query);
    return this.appService.getHello();
  }
}
