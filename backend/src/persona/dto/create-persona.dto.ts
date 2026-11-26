import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// Datos que se aceptan al crear una persona (POST /persona).
// Las longitudes siguen las columnas de la tabla persona.
export class CreatePersonaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  identificacion: string;

  @IsEmail({}, { message: 'correo debe ser un correo electrónico válido' })
  @MaxLength(150)
  correo: string;

  // telefono admite NULL en la tabla, por eso @IsOptional sí es correcto aquí.
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string | null;
}
