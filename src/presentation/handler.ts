import { APIGatewayEvent } from "aws-lambda";

export const getBrand = async (event: APIGatewayEvent) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: "Hello Offers API Challenge",
    event,
  }),
});