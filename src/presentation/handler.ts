import { APIGatewayEvent } from "aws-lambda";
import { apiGatewayAdapter } from "../main/adapters/api-gateway-adapter";
import { addBrandControllerFactory, getBrandControllerFactory } from "../main/factories";

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
