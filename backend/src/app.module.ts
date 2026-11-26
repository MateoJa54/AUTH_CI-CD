import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonaModule } from './persona/persona.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    // Lee backend/.env y el .env de la raíz, donde está POSTGRES_PASSWORD
    // (el mismo archivo que usa docker-compose.yml).
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '5434')),
        username: config.get<string>('DB_USER', 'biblioteca'),
        password: config.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('DB_NAME', 'biblioteca_db'),
        autoLoadEntities: true,
        // Las tablas se crean con SQL (database/01_schema.sql); TypeORM no debe alterarlas.
        synchronize: false,
      }),
    }),
    PersonaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
