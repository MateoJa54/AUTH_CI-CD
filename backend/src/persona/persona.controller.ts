import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { PersonaService } from './persona.service';

// Rutas HTTP de /persona. Solo recibe la petición y delega en el servicio.
@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post()
  create(@Body() dto: CreatePersonaDto) {
    return this.personaService.create(dto);
  }

  @Get()
  findAll() {
    return this.personaService.findAll();
  }

  // ParseUUIDPipe responde 400 si el id no es un UUID válido.
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.personaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePersonaDto) {
    return this.personaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.personaService.remove(id);
  }
}
