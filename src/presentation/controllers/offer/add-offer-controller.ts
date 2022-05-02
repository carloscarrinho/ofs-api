import { IController } from "../icontroller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest, notFound, ok, serverError } from "../../helpers/http-helper";
import { IValidation } from "../../validators/ivalidation";
import { IAddOffer } from "../../../application/use-cases/offer/iadd-offer";
import { IGetBrand } from "../../../application/use-cases/brand/iget-brand";

export class AddOfferController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly getBrand: IGetBrand,
    private readonly addOffer: IAddOffer,
  ) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(request.body); 
    if(error) return badRequest(error); 
    
    const { brandId } = request.body;

    try { 
      const brand = await this.getBrand.get(brandId);
      if (!brand) return notFound(brandId);

      const offer = await this.addOffer.add(request.body);

      return ok({ offer });
    } catch (err) {
      return serverError(err);
    }
  }
}