import { ILocation, ILocationModel } from "../../../../domain/entities/ilocation";

export interface ILocationRepository {
  store(locationModel: ILocationModel): Promise<ILocation>;
}