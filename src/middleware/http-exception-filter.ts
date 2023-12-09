import { NextFunction, Request, Response } from "express";

export class HttpExceptionFilter extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export function httpExceptionMiddleware(
  error: HttpExceptionFilter,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "INTERNAL_SERVER_ERROR";

  res.status(status).send({
    success: "false",
    message: message,
  });

  next();
}
