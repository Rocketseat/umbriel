import 'dotenv/config';
import mongoConfig from '@config/mongo';
import mongoose from 'mongoose';
import app from './app';

mongoose.connect(
  `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    useCreateIndex: true,
    useFindAndModify: false,
  },
);

app.listen(process.env.PORT || 3333, () => {
  console.log('⚡️ Server listening on http://localhost:3333');
});
