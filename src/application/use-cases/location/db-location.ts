import { ILocation, ILocationModel } from "../../../domain/entities/ilocation";
import { ILocationRepository } from "../../../infrastructure/db/repositories/location/ilocation-repository";
import { IAddLocation,  } from "./iadd-location";

export class DbLocation implements IAddLocation {
  constructor(private readonly repository: ILocationRepository) {}

  async add(locationModel: ILocationModel): Promise<ILocation> {
    return await this.repository.store(locationModel);
  }
}