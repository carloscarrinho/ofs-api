export interface IOfferModel {
  brandId: string;
  name: string;
  startDate: string;
  endDate: string;
  locations?: string[]
}

export interface IOffer {
  id: string;
  brandId: string;
  name: string;
  startDate: string;
  endDate: string;
  locationsTotal: number;
  locations?: string[];
  createdAt?: string;
}
