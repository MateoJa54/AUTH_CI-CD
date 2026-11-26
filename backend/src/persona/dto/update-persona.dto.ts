import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, ValidateIf } from 'class-validator';
import { CreatePersonaDto } from './create-persona.dto';

// Cambios parciales (PATCH /persona/:id): todos los campos son opcionales.
// skipNullProperties: false hace que un null en nombres, correo, etc. se valide
// (y se rechace con 400) en lugar de llegar a una columna NOT NULL.
export class UpdatePersonaDto extends PartialType(CreatePersonaDto, {
  skipNullProperties: false,
}) {
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  estado?: boolean;
}
