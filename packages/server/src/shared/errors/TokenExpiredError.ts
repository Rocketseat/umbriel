export default class TokenExpiredError {
  public message: string;

  public data: object;

  public statusCode: number;

  constructor(message: string, data?: object, statusCode = 501) {
    this.message = message;
    this.statusCode = statusCode;

    if (data) {
      this.data = data;
    }
  }
}
