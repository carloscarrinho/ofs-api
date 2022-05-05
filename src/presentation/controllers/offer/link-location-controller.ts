import { IController } from "../icontroller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "../../helpers/http-helper";
import { IValidation } from "../../validators/ivalidation";
import { ILinkLocation } from "../../../application/use-cases/offer/ilink-location";
import { IGetLocation } from "../../../application/use-cases/location/iget-location";

export class LinkLocationController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly getLocation: IGetLocation,
    private readonly linkLocation: ILinkLocation
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate({
      ...request.params,
      ...request.body,
    });
    if (error) return badRequest(error);

    const { offerId } = request.params;
    const { brandId, locationId } = request.body;

    try {
      const location = await this.getLocation.get(brandId, locationId);
      if (!location) return notFound(locationId);

      const result = await this.linkLocation.link({
        brandId,
        offerId,
        locationId,
      });

      return ok({ result });
    } catch (err) {
      return serverError(err);
    }
  }
}
