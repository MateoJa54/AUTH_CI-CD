import { Test, TestingModule } from '@nestjs/testing';
import { PersonaController } from './persona.controller';
import { PersonaService } from './persona.service';

describe('PersonaController', () => {
  let controller: PersonaController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonaController],
      providers: [{ provide: PersonaService, useValue: service }],
    }).compile();

    controller = module.get(PersonaController);
  });

  it('delega cada operación en el servicio', async () => {
    const id = '3f6c2b9e-8a1d-4c7e-9b2a-1d5e6f7a8b9c';
    await controller.findAll();
    await controller.findOne(id);
    await controller.update(id, { telefono: '0987654321' });
    await controller.remove(id);

    expect(service.findAll).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(id);
    expect(service.update).toHaveBeenCalledWith(id, { telefono: '0987654321' });
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
