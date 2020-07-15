import 'reflect-metadata';
import 'dotenv/config';
import { container } from 'tsyringe';

container.register('LoggerProvider', {
  useValue: {
    log: jest.fn(),
  },
});
