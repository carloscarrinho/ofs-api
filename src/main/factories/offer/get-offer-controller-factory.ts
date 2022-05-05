import { DbOffer } from "../../../application/use-cases/offer/db-offer";
import { DynamoLocationRepository } from "../../../infrastructure/db/repositories/location/dynamo-location-repository";
import { DynamoOfferRepository } from "../../../infrastructure/db/repositories/offer/dynamo-offer-repository";
import { GetOfferController } from "../../../presentation/controllers/offer/get-offer-controller"
import { RequiredFieldsValidator } from "../../../presentation/validators/required-fiels-validator";
import { ValidationComposite } from "../../../presentation/validators/validation-composite";

export const getOfferControllerFactory = () => {
  const validation = new ValidationComposite([
    new RequiredFieldsValidator(["brandId", "offerId"])
  ]);
  
  const dynamoSettings = {
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  }
  const offerRepository = new DynamoOfferRepository(dynamoSettings);
  const locationRepository = new DynamoLocationRepository(dynamoSettings);
  const dbOffer = new DbOffer(offerRepository, locationRepository);

  return new GetOfferController(validation, dbOffer);
}