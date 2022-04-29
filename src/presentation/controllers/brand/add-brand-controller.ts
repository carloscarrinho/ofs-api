import { IController } from "../icontroller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest, ok } from "../../helpers/http-helper";
import { IValidation } from "../../validators/ivalidation";
import { IAddBrand } from "../../../application/use-cases/brand/iadd-brand";

export class AddBrandController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addBrand: IAddBrand
  ) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(request.body); 
    if(error) return badRequest(error); 

    this.addBrand.add(request.body.name)

    return ok({ message: "ok" });
  }
}