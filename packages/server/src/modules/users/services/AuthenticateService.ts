import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import User, { UserDocument } from '@modules/users/infra/mongoose/schemas/User';

import authConfig from '@config/auth';

import Service from '@shared/core/Service';

interface Request {
  email: string;
  password: string;
}

interface Response {
  token: string;
  user: UserDocument;
}

@injectable()
class AuthenticateService implements Service<Request, Response> {
  async execute({ email, password }: Request): Promise<Response> {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw new Error('User not found');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new Error('Password does not match');
    }

    return {
      token: jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
      user,
    };
  }
}

export default AuthenticateService;
