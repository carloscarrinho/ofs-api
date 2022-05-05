import { ILocation, ILocationModel } from "../../../../domain/entities/ilocation";

export interface ILocationRepository {
  store(locationModel: ILocationModel): Promise<ILocation>;
  find(brandId: string, locationId: string): Promise<ILocation>;
  linkOffer(brandId: string, locationId: string): Promise<boolean>;
}