import { MissingParamError } from "../../../../src/presentation/errors/missing-param-error";
import { RequiredFieldsValidator } from "../../../../src/presentation/validators/required-fiels-validator";

describe("Unit", () => {
  describe("Presentation::Validators", () => {
    describe("RequiredFieldsValidator.validate()", () => {
      it("Should return MissingParamError if any required field is missing", async () => {
        // GIVEN
        const fieldName = "any-field";
        const validator = new RequiredFieldsValidator([fieldName]);

        // WHEN
        const error = validator.validate({});

        // THEN
        expect(error).toEqual(new MissingParamError(fieldName));
      });

      it("Should return null if all required fields were provided", async () => {
        // GIVEN
        const fields = ["any-field", "any-field-2"];
        const validator = new RequiredFieldsValidator(fields);

        // WHEN
        const error = validator.validate({
          [fields[0]]: "valid-field",
          [fields[1]]: "valid-field",
        });

        // THEN
        expect(error).toBeFalsy();
      });
    });
  });
});
