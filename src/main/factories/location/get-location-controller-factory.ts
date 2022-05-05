import { DbLocation } from "../../../application/use-cases/location/db-location";
import { DynamoLocationRepository } from "../../../infrastructure/db/repositories/location/dynamo-location-repository";
import { GetLocationController } from "../../../presentation/controllers/location/get-location-controller"
import { RequiredFieldsValidator } from "../../../presentation/validators/required-fiels-validator";
import { ValidationComposite } from "../../../presentation/validators/validation-composite";

export const getLocationControllerFactory = () => {
  const validation = new ValidationComposite([
    new RequiredFieldsValidator(["brandId", "locationId"])
  ]);
  
  const dynamoSettings = {
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  }
  const dynamoLocationRepository = new DynamoLocationRepository(dynamoSettings);
  const dbLocation = new DbLocation(dynamoLocationRepository);

  return new GetLocationController(validation, dbLocation);
}