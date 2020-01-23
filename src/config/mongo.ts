export default {
  host: process.env.MONGO_URL || 'localhost',
  port: process.env.MONGO_PORT || 27017,
  username: process.env.MONGO_USER,
  password: process.env.MONGO_PASS,
  database: process.env.MONGO_DB,
};
