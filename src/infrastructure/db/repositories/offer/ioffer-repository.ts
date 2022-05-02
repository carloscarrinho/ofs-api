import { IOffer, IOfferModel } from "../../../../domain/entities/ioffer";

export interface IOfferRepository {
  store(offerModel: IOfferModel): Promise<IOffer>;
}