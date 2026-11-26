import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { PersonaController } from './persona.controller';
import { PersonaService } from './persona.service';

// Módulo de Persona: registra el repositorio de la entidad, el controlador y el servicio.
@Module({
  imports: [TypeOrmModule.forFeature([Persona])],
  controllers: [PersonaController],
  providers: [PersonaService],
})
export class PersonaModule {}
