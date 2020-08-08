import express from 'express';

import { container } from 'tsyringe';
import * as Yup from 'yup';

import AuthenticateService from '@modules/users/services/AuthenticateService';

const sessionRouter = express.Router();

sessionRouter.post('/', async (req, res) => {
  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  const { email, password } = req.body;

  const authService = container.resolve(AuthenticateService);

  const result = await authService.execute({ email, password });

  return res.json(result);
});

export default sessionRouter;
