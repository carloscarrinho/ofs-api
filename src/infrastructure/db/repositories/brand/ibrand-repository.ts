import { IBrandModel } from "../../../../application/use-cases/brand/iadd-brand";
import { IBrand } from "../../../../domain/entities/ibrand";

export interface IBrandRepository {
  store(brandData: IBrandModel): Promise<IBrand>;
}