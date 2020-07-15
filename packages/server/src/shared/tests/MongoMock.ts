import mongoose, { Mongoose } from 'mongoose';

class MongoMock {
  private database: Mongoose;

  async connect(): Promise<void> {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }

    this.database = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  disconnect(): Promise<void> {
    return this.database.connection.close();
  }
}

export default new MongoMock();
