import { badRequest, notFound, ok, serverError } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { IValidation } from "../../validators/ivalidation";
import { IController } from "../icontroller";
import { IGetLocation } from "../../../application/use-cases/location/iget-location";

export class GetLocationController implements IController {
  constructor(
    private readonly validator: IValidation,
    private readonly getLocation: IGetLocation
  ) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validate({
      ...request.header,
      ...request.params
    });
    if(error) return badRequest(error);
    
    try {
      const { brandId } = request.header;
      const { locationId } = request.params;
      const location = await this.getLocation.get(brandId, locationId);

      if(!location) return notFound(locationId);
      
      return ok({ location });
    } catch (err) {
      return serverError(err);
    }
  }
}
