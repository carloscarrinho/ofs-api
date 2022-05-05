import { badRequest, notFound, ok, serverError } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { IValidation } from "../../validators/ivalidation";
import { IController } from "../icontroller";
import { IGetOffer } from "../../../application/use-cases/offer/iget-offer";

export class GetOfferController implements IController {
  constructor(
    private readonly validator: IValidation,
    private readonly getOffer: IGetOffer
  ) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validate({
      ...request.header,
      ...request.params
    });
    
    if(error) return badRequest(error);
    
    try {
      const { brandId } = request.header;
      const { offerId } = request.params;
      const offer = await this.getOffer.get(brandId, offerId);

      if(!offer) return notFound(offerId);
      
      return ok({ offer });
    } catch (err) {
      return serverError(err);
    }
  }
}
