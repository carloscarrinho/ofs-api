import { IOffer, IOfferModel } from "../../../domain/entities/ioffer";
import { ILocationRepository } from "../../../infrastructure/db/repositories/location/ilocation-repository";
import { IOfferRepository } from "../../../infrastructure/db/repositories/offer/ioffer-repository";
import { IAddOffer } from "./iadd-offer";
import { ILinkLocation, ILinkLocationModel } from "./ilink-location";

export class DbOffer implements IAddOffer, ILinkLocation {
  constructor(
    private readonly offersRepository: IOfferRepository,
    private readonly locationsRepository: ILocationRepository
  ) {}

  async add(offerModel: IOfferModel): Promise<IOffer> {
    return await this.offersRepository.store(offerModel);
  }

  async link(linkLocationModel: ILinkLocationModel): Promise<boolean> {
    const result = await this.offersRepository.linkLocation(linkLocationModel);
    if(!result) return false;
    
    return await this.locationsRepository.linkOffer(
      linkLocationModel.brandId,
      linkLocationModel.locationId,
    );
  }
}