import bcrypt from 'bcryptjs';
import { container } from 'tsyringe';

import User from '@modules/users/infra/mongoose/schemas/User';
import AuthenticateService from '@modules/users/services/AuthenticateService';

import MongoMock from '@shared/tests/MongoMock';

describe('Add Recipients to Queue', () => {
  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should be able to authenticate', async () => {
    await User.create({
      name: 'Test',
      email: 'test@example.com',
      password: bcrypt.hashSync('testpass', 4),
    });

    const authenticate = container.resolve(AuthenticateService);

    const result = await authenticate.execute({
      email: 'test@example.com',
      password: 'testpass',
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
  });
});
