import { HttpResponse } from "../protocols/http";

export const ok = (body: object): HttpResponse => ({
  statusCode: 200,
  body,
});