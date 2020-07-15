export default interface LoggerProvider {
  log(level: string, message: string, metadata?: object): void;
}
