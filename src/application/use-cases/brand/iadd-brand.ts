import { IBrand, IBrandModel } from "../../../domain/entities/ibrand";
export interface IAddBrand {
  add(brandModel: IBrandModel): Promise<IBrand>;
}