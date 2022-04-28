import { HttpResponse } from "../protocols/http";

export const ok = (body: object): HttpResponse => ({
  statusCode: 200,
  body,
});

export const badRequest = (error: Error) => ({
  statusCode: 400,
  body: { message: error.message },
});
