import { APIGatewayEvent } from "aws-lambda";
import { apiGatewayAdapter } from "../main/adapters/api-gateway-adapter";
import { getBrandControllerFactory } from "../main/factories/get-brand-controller-factory";

export const getBrand = async (event: APIGatewayEvent) => {
  const response = await apiGatewayAdapter(event, getBrandControllerFactory());

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};