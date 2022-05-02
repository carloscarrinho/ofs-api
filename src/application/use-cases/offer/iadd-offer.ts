import { IOfferModel, IOffer } from "../../../domain/entities/ioffer";

export interface IAddOffer {
  add(offerModel: IOfferModel): Promise<IOffer>;
}