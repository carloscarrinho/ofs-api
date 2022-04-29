import { ServerError } from "../errors/server-error";
import { HttpResponse } from "../protocols/http";

export const ok = (body: object): HttpResponse => ({
  statusCode: 200,
  body,
});

export const badRequest = (error: Error) => ({
  statusCode: 400,
  body: { message: error.message },
});

export const forbbiden = (error: Error) => ({
  statusCode: 403,
  body: { message: error.message },
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack) 
});