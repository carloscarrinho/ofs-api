import { HttpRequest, HttpResponse } from "../../protocols/http";
import { IController } from "../icontroller";
import { badRequest, forbbiden, ok } from "../../helpers/http-helper";
import { MissingParamError } from "../../errors/missing-param-error";
import { InvalidParamError } from "../../errors/invalid-param-error";

export class AddBrandController implements IController {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const missinXApiKey = request.header["x-api-key"] ? null : new MissingParamError("x-api-key");
    const invalidXApiKey = request.header["x-api-key"] == "valid-api-key" ? null : new InvalidParamError("x-api-key");
    
    if(missinXApiKey) return badRequest(missinXApiKey); 
    if(invalidXApiKey) return forbbiden(invalidXApiKey); 
    
    return ok({ message: "ok" });
  }
}