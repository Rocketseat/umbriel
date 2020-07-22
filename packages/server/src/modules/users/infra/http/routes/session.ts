import express from 'express';

import { container } from 'tsyringe';

import AuthenticateService from '@modules/users/services/AuthenticateService';

const sessionRouter = express.Router();

sessionRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const authService = container.resolve(AuthenticateService);

  const result = await authService.execute({ email, password });

  return res.json(result);
});

export default sessionRouter;
