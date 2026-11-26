import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';

// Códigos de error de PostgreSQL que se traducen a respuestas HTTP.
const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personas: Repository<Persona>,
  ) {}

  async create(dto: CreatePersonaDto): Promise<Persona> {
    try {
      return await this.personas.save(this.personas.create(dto));
    } catch (error) {
      throw this.traducirError(error);
    }
  }

  findAll(): Promise<Persona[]> {
    return this.personas.find({ order: { apellidos: 'ASC', nombres: 'ASC' } });
  }

  async findOne(id: string): Promise<Persona> {
    const persona = await this.personas.findOneBy({ id_persona: id });
    if (!persona) {
      throw new NotFoundException(`No existe la persona con id ${id}`);
    }
    return persona;
  }

  async update(id: string, dto: UpdatePersonaDto): Promise<Persona> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar');
    }
    // Un solo UPDATE ... WHERE: si la fila no existe, affected es 0 y se responde 404.
    // (Leer y luego save() volvería a insertar una persona borrada en paralelo.)
    let affected: number | undefined;
    try {
      ({ affected } = await this.personas.update({ id_persona: id }, dto));
    } catch (error) {
      throw this.traducirError(error);
    }
    if (!affected) {
      throw new NotFoundException(`No existe la persona con id ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    let affected: number | null | undefined;
    try {
      ({ affected } = await this.personas.delete({ id_persona: id }));
    } catch (error) {
      throw this.traducirError(error);
    }
    if (!affected) {
      throw new NotFoundException(`No existe la persona con id ${id}`);
    }
  }

  private traducirError(error: unknown): unknown {
    if (error instanceof QueryFailedError) {
      const code = (error as QueryFailedError & { driverError?: { code?: string } })
        .driverError?.code;
      if (code === PG_UNIQUE_VIOLATION) {
        return new ConflictException('Ya existe una persona con esa identificación');
      }
      if (code === PG_FOREIGN_KEY_VIOLATION) {
        return new ConflictException(
          'La persona tiene un usuario asociado y no se puede eliminar',
        );
      }
    }
    return error;
  }
}
