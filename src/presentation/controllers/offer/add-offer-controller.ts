import { IController } from "../icontroller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { IValidation } from "../../validators/ivalidation";
import { IAddOffer } from "../../../application/use-cases/offer/iadd-offer";

export class AddOfferController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addOffer: IAddOffer,
  ) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(request.body); 
    if(error) return badRequest(error); 

    try {
      await this.addOffer.add(request.body);
    } catch (err) {
      return serverError(err);
    }

    return null;
  }
}