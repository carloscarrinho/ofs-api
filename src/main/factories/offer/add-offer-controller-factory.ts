import { DbBrand } from "../../../application/use-cases/brand/db-brand";
import { DbOffer } from "../../../application/use-cases/offer/db-offer";
import { DynamoBrandRepository } from "../../../infrastructure/db/repositories/brand/dynamo-brand-repository";
import { DynamoOfferRepository } from "../../../infrastructure/db/repositories/offer/dynamo-offer-repository";
import { DynamoLocationRepository } from "../../../infrastructure/db/repositories/location/dynamo-location-repository";
import { AddOfferController } from "../../../presentation/controllers/offer/add-offer-controller";
import { RequiredFieldsValidator } from "../../../presentation/validators/required-fiels-validator";
import { ValidationComposite } from "../../../presentation/validators/validation-composite";

export const addOfferControllerFactory = () => {
  const validation = new ValidationComposite([
    new RequiredFieldsValidator([
      "brandId",
      "name",
      "startDate",
      "endDate",
    ]),
  ]);

  const dynamoSettings = {
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  };
  const dynamoBrandRepository = new DynamoBrandRepository(dynamoSettings);
  const dbBrand = new DbBrand(dynamoBrandRepository);

  const dynamoOfferRepository = new DynamoOfferRepository(dynamoSettings);
  const dynamoLocationRepository = new DynamoLocationRepository(dynamoSettings);
  const dbOffer = new DbOffer(dynamoOfferRepository, dynamoLocationRepository);

  return new AddOfferController(validation, dbBrand, dbOffer);
};
