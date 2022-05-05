import { IBrand, IBrandModel } from "../../../src/domain/entities/ibrand";

export const generateBrandModel = (data?: Partial<IBrandModel>): IBrandModel => ({
  name: "any-brand-name",
});

export const generateBrandEntity = (data?: Partial<IBrand>): IBrand => ({
  id: "any-brand-id",
  name: "any-name",
  createdAt: "2022-04-29T20:41:54.630Z",
});