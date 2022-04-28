import { HttpRequest, HttpResponse } from "../../protocols/http";
import { IController } from "../icontroller";
import { badRequest, ok } from "../../helpers/http-helper";
import { MissingParamError } from "../../errors/missing-param-error";

export class AddBrandController implements IController {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = request.header["x-api-key"] ? null : new MissingParamError("x-api-key");
    
    if(error) return badRequest(error); 
    
    return ok({ message: "ok" });
  }
}