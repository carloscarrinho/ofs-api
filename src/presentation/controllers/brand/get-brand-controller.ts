import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { IValidation } from "../../validators/ivalidation";
import { IController } from "../icontroller";

export class GetBrandController implements IController {
  constructor(private readonly validator: IValidation) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validate(request.params);
    if(error) return badRequest(error);

    try {
      return ok({ success: request.params.brandId });
    } catch (error) {
      return serverError(error);
    }
  }
}
