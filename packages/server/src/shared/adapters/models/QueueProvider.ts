interface Job {
  data: object;
}

export default interface QueueProvider {
  add(data: object): Promise<void>;
  process(processFunction: (job: Job) => Promise<void>): void;
}
