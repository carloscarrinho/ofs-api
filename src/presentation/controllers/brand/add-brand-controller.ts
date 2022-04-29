import { IController } from "../icontroller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest, ok } from "../../helpers/http-helper";
import { IValidation } from "../../validators/ivalidation";

export class AddBrandController implements IController {
  constructor(private validation: IValidation) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(request.body);
    
    if(error) return badRequest(error); 
    
    return ok({ message: "ok" });
  }
}