import { DbLocation } from "../../../application/use-cases/location/db-location";
import { DbOffer } from "../../../application/use-cases/offer/db-offer";
import { DynamoLocationRepository } from "../../../infrastructure/db/repositories/location/dynamo-location-repository";
import { DynamoOfferRepository } from "../../../infrastructure/db/repositories/offer/dynamo-offer-repository";
import { LinkLocationController } from "../../../presentation/controllers/offer/link-location-controller";
import { RequiredFieldsValidator } from "../../../presentation/validators/required-fiels-validator";
import { ValidationComposite } from "../../../presentation/validators/validation-composite";

export const linkLocationControllerFactory = () => {
  const validation = new ValidationComposite([
    new RequiredFieldsValidator([ "brandId", "offerId", "locationId" ]),
  ]);

  const dynamoSettings = {
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  };
  const dynamoLocationRepository = new DynamoLocationRepository(dynamoSettings);
  const dbLocation = new DbLocation(dynamoLocationRepository);

  const dynamoOfferRepository = new DynamoOfferRepository(dynamoSettings);
  const dbOffer = new DbOffer(dynamoOfferRepository, dynamoLocationRepository);

  return new LinkLocationController(validation, dbLocation, dbOffer);
};
