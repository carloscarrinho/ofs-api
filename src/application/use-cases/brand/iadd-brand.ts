import { IBrand } from "../../../domain/entities/ibrand";

export interface IBrandModel {
  name: string;
}

export interface IAddBrand {
  add(brandModel: IBrandModel): Promise<IBrand>;
}