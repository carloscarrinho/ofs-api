import { IBrand, IBrandModel } from "../../../domain/entities/ibrand";
import { IBrandRepository } from "../../../infrastructure/db/repositories/brand/ibrand-repository";
import { IAddBrand,  } from "./iadd-brand";
import { IGetBrand } from "./iget-brand";

export class DbBrand implements IAddBrand, IGetBrand {
  constructor(private readonly repository: IBrandRepository) {}

  async add(brandModel: IBrandModel): Promise<IBrand> {
    return await this.repository.store(brandModel);
  }

  async get(id: string): Promise<IBrand> {
    return await this.repository.find(id);
  }
}