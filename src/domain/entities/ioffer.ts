export interface IOfferModel {
  brandId: string;
  name: string;
  startDate: string;
  endDate: string;
  type: {
    name: string;
    value: string;
  };
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
  status: string;
  type: {
    name: string;
    value: string;
  };
  createdAt?: string;
}
