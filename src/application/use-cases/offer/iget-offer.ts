import { IOffer } from "../../../domain/entities/ioffer";

export interface IGetOffer {
  get(brandId: string, offerId: string): Promise<IOffer>;
}