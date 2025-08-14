class AppError extends Error {
  public statusCode: number;
  //   public status: string;
  constructor(statusCode: number, message: string, stack = "") {
    super(message); //trow new error
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    // this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // this.isOperational = true;
  }
}

export default AppError;
