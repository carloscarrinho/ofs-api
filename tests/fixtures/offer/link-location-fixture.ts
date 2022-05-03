import { ILinkLocationModel } from "../../../src/application/use-cases/offer/ilink-location";

export const generateLinkLocationModel = (data?: object): ILinkLocationModel => ({
  brandId: "any-brand-id",
  offerId: "any-offer-id",
  locationId: "any-location-id",
  ...data,
});