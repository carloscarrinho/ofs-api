import { InvalidParamError } from "../../../../src/presentation/errors/invalid-param-error";
import { XApiKeyValidator } from "../../../../src/presentation/validators/x-api-key-validator";

describe("Unit", () => {
  describe("Presentation::Validators", () => {
    describe("XApiKeyValidator.validate()", () => {
      it("Should return InvalidParamError if x-api-key is not valid", async () => {
        // GIVEN
        const validator = new XApiKeyValidator();

        // WHEN
        const error = validator.validate("not-valid");

        // THEN
        expect(error).toEqual(new InvalidParamError("x-api-key"));
      });
      
      it("Should return null if x-api-key is valid", async () => {
        // GIVEN
        const validator = new XApiKeyValidator();

        // WHEN
        const error = validator.validate("valid-api-key");

        // THEN
        expect(error).toBeFalsy();
      });
    });
  });
});
