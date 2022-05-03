import { IController } from "../icontroller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest, notFound, ok, serverError } from "../../helpers/http-helper";
import { IValidation } from "../../validators/ivalidation";
import { IGetBrand } from "../../../application/use-cases/brand/iget-brand";
import { IAddLocation } from "../../../application/use-cases/location/iadd-location";

export class AddLocationController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly getBrand: IGetBrand,
    private readonly addLocation: IAddLocation,
  ) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(request.body); 
    if(error) return badRequest(error); 
    
    const { brandId } = request.body;

    try { 
      const brand = await this.getBrand.get(brandId);
      if (!brand) return notFound(brandId);

      const location = await this.addLocation.add(request.body);

      return ok({ location });
    } catch (err) {
      return serverError(err);
    }
  }
}