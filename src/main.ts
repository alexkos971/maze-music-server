import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from "cookie-parser";

async function start() {
  const app = await NestFactory.create(AppModule);

  // Init Swagger
  const config = new DocumentBuilder()
    .setTitle('Maze Music Server')
    .setDescription('Private API for maze-music clients')
    .setVersion('1.0')
    .addTag('music')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document, {
    customSiteTitle: "Maze Music Server",
  });

  app.use(cookieParser());

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
start();
