import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { Persona } from './entities/persona.entity';
import { PersonaService } from './persona.service';

const ID = '3f6c2b9e-8a1d-4c7e-9b2a-1d5e6f7a8b9c';

const personaDePrueba: Persona = {
  id_persona: ID,
  nombres: 'Ana',
  apellidos: 'Perez',
  identificacion: 'PRUEBA-001',
  correo: 'ana.prueba@example.com',
  telefono: '0991234567',
  estado: true,
};

function errorPostgres(code: string) {
  return new QueryFailedError('INSERT ...', [], Object.assign(new Error(), { code }));
}

describe('PersonaService', () => {
  let service: PersonaService;
  const repo = {
    create: jest.fn((dto: Partial<Persona>) => dto),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonaService,
        { provide: getRepositoryToken(Persona), useValue: repo },
      ],
    }).compile();

    service = module.get(PersonaService);
  });

  it('crea una persona', async () => {
    repo.save.mockResolvedValue(personaDePrueba);
    await expect(service.create(personaDePrueba)).resolves.toEqual(personaDePrueba);
  });

  it('responde 409 si la identificación ya existe', async () => {
    repo.save.mockRejectedValue(errorPostgres('23505'));
    await expect(service.create(personaDePrueba)).rejects.toBeInstanceOf(ConflictException);
  });

  it('responde 404 al consultar una persona inexistente', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(ID)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('actualiza y devuelve la persona', async () => {
    repo.update.mockResolvedValue({ affected: 1 });
    repo.findOneBy.mockResolvedValue({ ...personaDePrueba, telefono: '0987654321' });
    await expect(service.update(ID, { telefono: '0987654321' })).resolves.toMatchObject({
      telefono: '0987654321',
    });
    expect(repo.update).toHaveBeenCalledWith({ id_persona: ID }, { telefono: '0987654321' });
  });

  it('responde 404 al actualizar una persona inexistente', async () => {
    repo.update.mockResolvedValue({ affected: 0 });
    await expect(service.update(ID, { telefono: '1' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('responde 400 si el PATCH no trae campos', async () => {
    await expect(service.update(ID, {})).rejects.toBeInstanceOf(BadRequestException);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('responde 404 al eliminar una persona inexistente', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove(ID)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('responde 409 si la persona tiene un usuario asociado', async () => {
    repo.delete.mockRejectedValue(errorPostgres('23503'));
    await expect(service.remove(ID)).rejects.toBeInstanceOf(ConflictException);
  });
});
