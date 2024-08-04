import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from '@nestjs/common';


async function start() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: true,
    credentials: true,
  });

  // Init Swagger
  const config = new DocumentBuilder()
    .setTitle('Maze Music Server')
    .setDescription('Private API for maze-music clients')
    .setVersion('1.0')
    .addCookieAuth('authCookie', {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer'
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document, {
    customSiteTitle: "Maze Music Server",
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    skipUndefinedProperties: false
  }));

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
start();
