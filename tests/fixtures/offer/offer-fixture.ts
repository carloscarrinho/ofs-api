import { IOffer, IOfferModel } from "../../../src/domain/entities/ioffer";
import { OfferStatuses } from "../../../src/domain/enums/offer-statuses";

export const generateOfferModel = (data?: Partial<IOfferModel>): IOfferModel => ({
  brandId: "any-brand-id",
  name: "any-offer-name",
  startDate: "2022-04-29T20:41:54.630Z",
  endDate: "2022-05-29T20:41:54.630Z",
  ...data,
});

export const generateOfferEntity = (data?: Partial<IOffer>): IOffer => ({
  id: "any-offer-id",
  locationsTotal: 0,
  createdAt: "2022-05-29T20:41:54.630Z",
  ...generateOfferModel()
});