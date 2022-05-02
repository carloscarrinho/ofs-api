import { AddBrandController } from "../../../../../src/presentation/controllers/brand/add-brand-controller";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { IAddBrand } from "../../../../../src/application/use-cases/brand/iadd-brand";

const makeController = ({
  validate,
  add,
}: {
  validate?: Function;
  add?: Function;
}): AddBrandController => {
  const validation = {
    validate: validate ?? jest.fn().mockReturnValueOnce(null),
  } as unknown as IValidation;

  const addBrand = {
    add:
      add ?? jest.fn().mockResolvedValue({ id: "some_id", name: "any-name" }),
  } as unknown as IAddBrand;

  return new AddBrandController(validation, addBrand);
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
      it("Should call Validation with body provided values", async () => {
        // Given
        const dependencies = { validate: jest.fn() };
        const addBrandController = makeController(dependencies);
        const request = makeRequest();

        // When
        await addBrandController.handle(request);

        // Then
        expect(dependencies.validate).toHaveBeenCalledWith(request.body);
      });

      it("Should return 400 if validation returns error", async () => {
        // GIVEN
        const dependencies = {
          validate: jest.fn().mockReturnValueOnce(new Error()),
        };
        const addBrandController = makeController(dependencies);
        const request = makeRequest({ header: {}, body: {} });

        // WHEN
        const response = await addBrandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });

      it("Should call AddBrand with required values", async () => {
        // GIVEN
        const dependencies = { add: jest.fn() };
        const addBrandController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        addBrandController.handle(request);

        // THEN
        expect(dependencies.add).toBeCalledWith(request.body);
      });

      it("Should return 500 if AddBrand throws an error", async () => {
        // GIVEN
        const error = new Error();
        error.stack = "any_stack";

        const dependencies = {
          add: jest.fn().mockImplementationOnce(() => {
            throw error;
          }),
        };
        const addBrandController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        const response = await addBrandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(500);
      });

      it("Should return 200 if added brand successfully", async () => {
        // GIVEN
        const addBrandController = makeController({});
        const request = makeRequest();

        // WHEN
        const response = await addBrandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(200);
      });
    });
  });
});
