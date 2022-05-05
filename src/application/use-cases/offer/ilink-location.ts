export interface ILinkLocationModel {
  brandId: string;
  offerId: string;
  locationId: string;
}

export interface ILinkLocation {
  link(linkLocationModel: ILinkLocationModel): Promise<boolean>;
}