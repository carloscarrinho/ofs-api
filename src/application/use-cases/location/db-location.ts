import { ILocation, ILocationModel } from "../../../domain/entities/ilocation";
import { ILocationRepository } from "../../../infrastructure/db/repositories/location/ilocation-repository";
import { IAddLocation,  } from "./iadd-location";
import { IGetLocation } from "./iget-location";

export class DbLocation implements IAddLocation, IGetLocation {
  constructor(private readonly repository: ILocationRepository) {}

  async add(locationModel: ILocationModel): Promise<ILocation> {
    return await this.repository.store(locationModel);
  }

  async get(brandId: string, locationId: string): Promise<ILocation> {
    return await this.repository.find(brandId, locationId);
  }
}