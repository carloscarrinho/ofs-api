import { APIGatewayEvent } from "aws-lambda";
import { DbBrand } from "../../application/use-cases/brand/db-brand";
import { DynamoBrandRepository } from "../../infrastructure/db/repositories/brand/dynamo-brand-repository";
import { GetBrandController } from "../../presentation/controllers/brand/get-brand-controller"
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";
import { RequiredFieldsValidator } from "../../presentation/validators/required-fiels-validator";
import { ValidationComposite } from "../../presentation/validators/validation-composite";

const makeController = () => {
  const validation = new ValidationComposite([
    new RequiredFieldsValidator(["brandId"])
  ]);
  
  const dynamoSettings = {
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  }
  const dynamoBrandRepository = new DynamoBrandRepository(dynamoSettings);
  const dbBrand = new DbBrand(dynamoBrandRepository);

  return new GetBrandController(validation, dbBrand);
}

export const adaptGetBrandController = async (event: APIGatewayEvent): Promise<HttpResponse> => {
  const controller = makeController(); 
  const httpRequest: HttpRequest = {
    header: event.headers,
    params: event.pathParameters,
    body: event.body
  }

  return await controller.handle(httpRequest);
}