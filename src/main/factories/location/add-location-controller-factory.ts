import { DbBrand } from "../../../application/use-cases/brand/db-brand";
import { DbLocation } from "../../../application/use-cases/location/db-location";
import { DynamoBrandRepository } from "../../../infrastructure/db/repositories/brand/dynamo-brand-repository";
import { DynamoLocationRepository } from "../../../infrastructure/db/repositories/location/dynamo-location-repository";
import { AddLocationController } from "../../../presentation/controllers/location/add-location-controller";
import { RequiredFieldsValidator } from "../../../presentation/validators/required-fiels-validator";
import { ValidationComposite } from "../../../presentation/validators/validation-composite";

export const addLocationControllerFactory = () => {
  const validation = new ValidationComposite([
    new RequiredFieldsValidator([
      "brandId",
      "address",
    ]),
  ]);

  const dynamoSettings = {
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  };
  const dynamoBrandRepository = new DynamoBrandRepository(dynamoSettings);
  const dbBrand = new DbBrand(dynamoBrandRepository);

  const dynamoLocationRepository = new DynamoLocationRepository(dynamoSettings);
  const dbLocation = new DbLocation(dynamoLocationRepository);

  return new AddLocationController(validation, dbBrand, dbLocation);
};
