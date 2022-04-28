import { APIGatewayEvent } from "aws-lambda";
import { adaptGetBrandController } from "../main/adapters/get-brand-controller";

export const getBrand = async (event: APIGatewayEvent) => {
  const response = await adaptGetBrandController(event);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};