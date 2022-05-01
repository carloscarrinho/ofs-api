import { APIGatewayEvent } from "aws-lambda";
import { IController } from "../../presentation/controllers/icontroller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";

export const apiGatewayAdapter = async (event: APIGatewayEvent, controller: IController): Promise<HttpResponse> => {
  const httpRequest: HttpRequest = {
    header: event.headers,
    params: event.pathParameters,
    body: JSON.parse(event.body)
  }

  return await controller.handle(httpRequest);
}