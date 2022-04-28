import { HttpRequest, HttpResponse } from "../protocols/http";

export interface IController {
  handle(request: HttpRequest): Promise<HttpResponse>;
}