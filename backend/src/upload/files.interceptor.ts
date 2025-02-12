// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import multer from 'fastify-multer';
// const upload = multer({ dest: 'uploads/' });

// @Injectable()
// export class FilesInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler) {
//     const req = context.switchToHttp().getRequest();
//     const res = context.switchToHttp().getResponse();

//     const preHandler = upload.array('files');
//     const promise = new Promise((resolve, reject) => {
//     });
//     await promise;
//     // preHandler.bind().call(req, res, () => {
//       console.log('Handler working');
//     });
//     return next.handle();
//   }
// }
