import { IOffer, IOfferModel } from "../../../domain/entities/ioffer";
import { IOfferRepository } from "../../../infrastructure/db/repositories/offer/ioffer-repository";
import { IAddOffer } from "./iadd-offer";
import { ILinkLocation, ILinkLocationModel } from "./ilink-location";

export class DbOffer implements IAddOffer, ILinkLocation {
  constructor(private readonly repository: IOfferRepository) {}

  async add(offerModel: IOfferModel): Promise<IOffer> {
    return await this.repository.store(offerModel);
  }

  async link(linkLocationModel: ILinkLocationModel): Promise<IOffer> {
    return await this.repository.linkLocation(linkLocationModel);
  }
}