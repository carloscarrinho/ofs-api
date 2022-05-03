import { APIGatewayEvent } from "aws-lambda";
import { apiGatewayAdapter } from "../main/adapters/api-gateway-adapter";
import {
  addBrandControllerFactory,
  getBrandControllerFactory,
  addOfferControllerFactory,
  addLocationControllerFactory,
} from "../main/factories";

export const getBrand = async (event: APIGatewayEvent) => {
  const response = await apiGatewayAdapter(event, getBrandControllerFactory());

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};

export const addBrand = async (event: APIGatewayEvent) => {
  const response = await apiGatewayAdapter(event, addBrandControllerFactory());

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};

export const addOffer = async (event: APIGatewayEvent) => {
  const response = await apiGatewayAdapter(event, addOfferControllerFactory());

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};

export const addLocation = async (event: APIGatewayEvent) => {
  const response = await apiGatewayAdapter(
    event,
    addLocationControllerFactory()
  );

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
