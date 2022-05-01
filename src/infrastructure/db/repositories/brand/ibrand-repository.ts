import { IBrand, IBrandModel } from "../../../../domain/entities/ibrand";

export interface IBrandRepository {
  store(brandData: IBrandModel): Promise<IBrand>;
  find(id: string): Promise<IBrand>;
}