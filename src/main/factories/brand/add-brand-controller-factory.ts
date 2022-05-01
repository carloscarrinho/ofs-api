import { DbBrand } from "../../../application/use-cases/brand/db-brand";
import { DynamoBrandRepository } from "../../../infrastructure/db/repositories/brand/dynamo-brand-repository";
import { AddBrandController } from "../../../presentation/controllers/brand/add-brand-controller"
import { RequiredFieldsValidator } from "../../../presentation/validators/required-fiels-validator";
import { ValidationComposite } from "../../../presentation/validators/validation-composite";

export const addBrandControllerFactory = () => {
  const validation = new ValidationComposite([
    new RequiredFieldsValidator(["name"])
  ]);
  
  const dynamoSettings = {
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  }
  const dynamoBrandRepository = new DynamoBrandRepository(dynamoSettings);
  const dbBrand = new DbBrand(dynamoBrandRepository);

  return new AddBrandController(validation, dbBrand);
}