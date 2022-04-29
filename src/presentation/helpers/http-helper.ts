import { ServerError } from "../errors/server-error";
import { NotFound } from "../errors/not-found-error";
import { HttpResponse } from "../protocols/http";

export const ok = (body: object): HttpResponse => ({
  statusCode: 200,
  body,
});

export const badRequest = (error: Error) => ({
  statusCode: 400,
  body: { message: error.message },
});

export const notFound = (id: string) => ({
  statusCode: 404,
  body: new NotFound(id),
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack) 
});