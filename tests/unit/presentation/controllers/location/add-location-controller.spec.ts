import { AddLocationController } from "../../../../../src/presentation/controllers/location/add-location-controller";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";
import { IAddLocation } from "../../../../../src/application/use-cases/location/iadd-location";
import { IGetBrand } from "../../../../../src/application/use-cases/brand/iget-brand";
import { generateLocationEntity, generateLocationModel } from "../../../../fixtures/location/location-fixture";

const makeController = ({
  validate,
  get,
  add,
}: {
  validate?: Function;
  get?: Function;
  add?: Function;
}): AddLocationController => {
  const validation = {
    validate: validate ?? jest.fn().mockReturnValueOnce(null),
  } as unknown as IValidation;

  const getBrand = {
    get: get ?? jest.fn().mockReturnValueOnce({ 
      id: "some-id", 
      name: "any-name",
      createdAt: "2022-04-29T10:00:00"
    }),
  } as unknown as IGetBrand;

  const addLocation = {
    add:
      add ?? jest.fn().mockResolvedValue({ 
        ...generateLocationEntity(),
     }),
  } as unknown as IAddLocation;
  
  return new AddLocationController(validation, getBrand, addLocation);
};

const makeRequest = (data?: object): HttpRequest => ({
  header: {
    "Content-Type": "application/json",
  },
  body: generateLocationModel(),
  ...data,
});

describe("Unit", () => {
  describe("Presentation::Controllers", () => {
    describe("AddLocationController.handle()", () => {
      it("Should call Validation with body provided values", async () => {
        // Given
        const dependencies = { validate: jest.fn() };
        const addLocationController = makeController(dependencies);
        const request = makeRequest();

        // When
        await addLocationController.handle(request);

        // Then
        expect(dependencies.validate).toHaveBeenCalledWith(request.body);
      });

      it("Should return 400 if validation returns error", async () => {
        // GIVEN
        const dependencies = {
          validate: jest.fn().mockReturnValueOnce(new Error()),
        };
        const addLocationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        const response = await addLocationController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });

      it("Should call GetBrand with brand id", async () => {
        // GIVEN
        const dependencies = { get: jest.fn(), add: jest.fn() };
        const addLocationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        addLocationController.handle(request);

        // THEN
        expect(dependencies.get).toBeCalledWith(request.body.brandId);
        expect(dependencies.add).not.toBeCalled();
      });

      it("Should return 404 if brand id is invalid", async () => {
        // Given
        const dependencies = {
          get: jest.fn().mockResolvedValueOnce(null),
          add: jest.fn(),
        };
        const request = makeRequest();
        const addLocationController = makeController(dependencies);

        // When
        const response = await addLocationController.handle(request);

        // Then
        expect(response.statusCode).toEqual(404);
        expect(dependencies.add).not.toBeCalled();
      });

      it("Should return 500 if GetBrand throws an error", async () => {
        // GIVEN
        const error = new Error();
        error.stack = "any_stack";

        const dependencies = {
          get: jest.fn().mockImplementationOnce(() => {
            throw error;
          }),
          add: jest.fn(),
        };
        const addController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        const response = await addController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(500);
        expect(dependencies.add).not.toBeCalled();
      });

      it("Should call AddLocation with required values", async () => {
        // GIVEN
        const dependencies = { add: jest.fn() };
        const addLocationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        await addLocationController.handle(request);

        // THEN
        expect(dependencies.add).toBeCalledWith(request.body);
      });

      it("Should return 500 if AddLocation throws an error", async () => {
        // GIVEN
        const error = new Error();
        error.stack = "any_stack";

        const dependencies = {
          add: jest.fn().mockImplementationOnce(() => {
            throw error;
          }),
        };
        const addController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        const response = await addController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(500);
      });

      it("Should return 200 if added location successfully", async () => {
        // GIVEN
        const addLocationController = makeController({});
        const request = makeRequest();

        // WHEN
        const response = await addLocationController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(200);
      });
    });
  });
});
