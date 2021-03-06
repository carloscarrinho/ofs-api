import { ILinkLocationModel } from "../../../../application/use-cases/offer/ilink-location";
import { IOffer, IOfferModel } from "../../../../domain/entities/ioffer";

export interface IOfferRepository {
  store(offerModel: IOfferModel): Promise<IOffer>;
  find(brandId: string, offerId: string): Promise<IOffer>;
  linkLocation(linkLocationModel: ILinkLocationModel): Promise<boolean>;
}