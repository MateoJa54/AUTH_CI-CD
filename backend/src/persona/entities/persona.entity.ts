import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Mapea la tabla persona creada en database/01_schema.sql.
// Los nombres de propiedad coinciden con las columnas, así la API devuelve
// id_persona, nombres, apellidos... igual que la base de datos.
@Entity({ name: 'persona' })
export class Persona {
  // La BD genera el UUID con DEFAULT gen_random_uuid().
  @PrimaryGeneratedColumn('uuid', { name: 'id_persona' })
  id_persona: string;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  identificacion: string;

  @Column({ type: 'varchar', length: 150 })
  correo: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string | null;

  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
