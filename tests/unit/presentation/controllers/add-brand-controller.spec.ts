import { AddBrandController } from "../../../../src/presentation/controllers/brand/add-brand-controller";
import { HttpRequest } from "../../../../src/presentation/protocols/http";
import { IValidation } from "../../../../src/presentation/validators/ivalidation";
import { RequiredFieldsValidator } from "../../../../src/presentation/validators/required-fiels-validator";
import { ValidationComposite } from "../../../../src/presentation/validators/validation-composite";

const makeController = (): AddBrandController => {
  const validators: IValidation[] = [new RequiredFieldsValidator(["name"])];

  const validation = new ValidationComposite(validators);

  return new AddBrandController(validation);
};

const makeRequest = (data?: object): HttpRequest => ({
  header: {
    "Content-Type": "application/json",
    "x-api-key": "valid-api-key",
  },
  body: {
    name: "any-name",
  },
  ...data,
});

describe("Unit", () => {
  describe("Presentation::Controllers", () => {
    describe("AddBrandController.handle()", () => {
      it("Should return 400 if validation returns error", async () => {
        // GIVEN
        const brandController = makeController();
        const request = makeRequest({ header: {}, body: {} });

        // WHEN
        const response = await brandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });

      it("Should return 200 if everything is OK", async () => {
        // GIVEN
        const brandController = makeController();
        const request = makeRequest();

        // WHEN
        const response = await brandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(200);
      });
    });
  });
});
