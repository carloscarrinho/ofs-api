import { APIGatewayEvent } from "aws-lambda";
import { GetBrandController } from "../../presentation/controllers/brand/get-brand-controller"
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";

const makeController = () => {
  return new GetBrandController();
}

export const adaptGetBrandController = async (event: APIGatewayEvent): Promise<HttpResponse> => {
  const controller = makeController(); 
  const httpRequest: HttpRequest = {
    header: event.headers,
    params: event.queryStringParameters,
    body: event.body
  }

  return await controller.handle(httpRequest);
}