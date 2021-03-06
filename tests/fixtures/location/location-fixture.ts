import { ILocation, ILocationModel } from "../../../src/domain/entities/ilocation";

export const generateLocationModel = (data?: Partial<ILocationModel>): ILocationModel => ({
  brandId: "any-brand-id",
  address: "any-location-address",
  ...data,
});

export const generateLocationEntity = (data?: Partial<ILocation>): ILocation => ({
  id: "any-location-id",
  hasOffer: false,
  createdAt: "2022-04-29T20:41:54.630Z",
  ...generateLocationModel()
});