export default class CustomError extends Error {
  public success: boolean;
  public status: number;
  public error: any;
  public message: string;

  constructor(status: number, error: any, message: string) {
    super(message);
    this.success = false;
    this.status = status;
    this.error = error;
    this.message = message;
  }
}
