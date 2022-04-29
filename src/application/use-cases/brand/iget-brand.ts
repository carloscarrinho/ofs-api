import { IBrand } from "../../../domain/entities/ibrand";

export interface IGetBrand {
  get(id: string): Promise<IBrand>;
}