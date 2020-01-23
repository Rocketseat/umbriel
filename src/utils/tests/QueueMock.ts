import IORedis from 'ioredis-mock';
import Queue from 'bull';

const mockRedisClient = new IORedis();

const mockedQueue = new Queue('mocked-queue', {
  createClient(): IORedis.Redis {
    return mockRedisClient;
  },
});

jest.mock('bull');

const MockedQueue = Queue as jest.Mock<Queue.Queue>;

MockedQueue.mockImplementation(() => mockedQueue);

export default mockedQueue;
