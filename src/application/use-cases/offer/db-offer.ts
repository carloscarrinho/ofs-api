import { IOffer, IOfferModel } from "../../../domain/entities/ioffer";
import { IOfferRepository } from "../../../infrastructure/db/repositories/offer/ioffer-repository";
import { IAddOffer,  } from "./iadd-offer";

export class DbOffer implements IAddOffer {
  constructor(private readonly repository: IOfferRepository) {}

  async add(offerModel: IOfferModel): Promise<IOffer> {
    return await this.repository.store(offerModel);
  }
}