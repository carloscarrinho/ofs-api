import { ILocation } from "../../../domain/entities/ilocation";

export interface IGetLocation {
  get(brandId: string, locationId: string): Promise<ILocation>;
}