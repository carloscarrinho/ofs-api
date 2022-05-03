import { IOffer, IOfferModel } from "../../../src/domain/entities/ioffer";
import { OfferStatuses } from "../../../src/domain/enums/offer-statuses";

export const generateOfferModel = (data?: object): IOfferModel => ({
  brandId: "any-brand-id",
  name: "any-brand-name",
  startDate: "2022-04-29T20:41:54.630Z",
  endDate: "2022-05-29T20:41:54.630Z",
  type: {
    value: "any-value",
    name: "any-name",
  },
  ...data,
});

export const generateOfferEntity = (data?: object): IOffer => ({
  id: "any-brand-id",
  locationsTotal: 0,
  status: OfferStatuses.CREATED,
  ...generateOfferModel()
});