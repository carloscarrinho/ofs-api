import { ILocationModel, ILocation } from "../../../domain/entities/ilocation";

export interface IAddLocation {
  add(locationModel: ILocationModel): Promise<ILocation>;
}