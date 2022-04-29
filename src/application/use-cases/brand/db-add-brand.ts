import { IBrand } from "../../../domain/entities/ibrand";
import { IBrandRepository } from "../../../infrastructure/db/repositories/brand/ibrand-repository";
import { IAddBrand, IBrandModel } from "./iadd-brand";

export class DbAddBrand implements IAddBrand {
  constructor(private readonly repository: IBrandRepository) {}
  
  async add(brandModel: IBrandModel): Promise<IBrand> {
    await this.repository.store(brandModel);
    return null;
  }
}