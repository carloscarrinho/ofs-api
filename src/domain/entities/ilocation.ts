export interface ILocationModel {
  brandId: string;
  address: string;
}

export interface ILocation {
  id: string;
  brandId: string;
  address: string;
  hasOffer: boolean;
  createdAt?: string;
}
