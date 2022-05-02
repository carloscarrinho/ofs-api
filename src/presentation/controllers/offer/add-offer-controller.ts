import { IController } from "../icontroller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { IValidation } from "../../validators/ivalidation";

export class AddOfferController implements IController {
  constructor(
    private readonly validation: IValidation,
  ) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(request.body); 
    if(error) return badRequest(error); 

    return null;
  }
}