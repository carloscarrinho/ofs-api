import { ILocation, ILocationModel } from "../../../src/domain/entities/ilocation";

export const generateLocationModel = (data?: object): ILocationModel => ({
  brandId: "any-brand-id",
  address: "any-location-address",
  ...data,
});

export const generateLocationEntity = (data?: object): ILocation => ({
  id: "any-location-id",
  hasOffer: false,
  createdAt: "2022-04-29T20:41:54.630Z",
  ...generateLocationModel()
});