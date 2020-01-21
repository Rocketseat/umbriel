import 'dotenv/config';
import Tag from '@schemas/Tag';

import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

export default app;
