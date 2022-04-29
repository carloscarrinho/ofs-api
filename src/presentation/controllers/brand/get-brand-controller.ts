import { badRequest, notFound, ok, serverError } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { IValidation } from "../../validators/ivalidation";
import { IController } from "../icontroller";
import { IGetBrand } from "../../../application/use-cases/brand/iget-brand";

export class GetBrandController implements IController {
  constructor(
    private readonly validator: IValidation,
    private readonly getBrand: IGetBrand
  ) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validate(request.params);
    if(error) return badRequest(error);
    
    try {
      const { brandId } = request.params;
      const brand = await this.getBrand.get(brandId);

      if(!brand) return notFound(brandId);
      
      return ok({ brand });
    } catch (error) {
      return serverError(error);
    }
  }
}
