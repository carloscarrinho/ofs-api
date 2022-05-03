import { GetLocationController } from "../../../../../src/presentation/controllers/location/get-location-controller";
import { IController } from "../../../../../src/presentation/controllers/icontroller";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { IGetLocation } from "../../../../../src/application/use-cases/location/iget-location";
import { generateLocationEntity } from "../../../../fixtures/location/location-fixture";

const makeController = ({
  validate,
  get
}:{
  validate?: Function
  get?: Function
}): IController => {
  const validation = {
    validate: validate ?? jest.fn().mockReturnValueOnce(null),
  } as unknown as IValidation;

  const getLocation = {
    get: get ?? jest.fn().mockReturnValueOnce(generateLocationEntity()),
  } as unknown as IGetLocation;

  return new GetLocationController(validation, getLocation);
}

const makeRequest = (data?: Partial<HttpRequest>): HttpRequest => ({
  header: { "Content-Type": "application/json", brandId: "any-brand-id" },
  params: { locationId: generateLocationEntity().id },
  ...data,
});

describe('Unit', () => {
  describe('Presentation::Controllers', () => {
    describe('GetLocationController.handle()', () => {
      it('Should call Validation with request header and params', async () => {
        // GIVEN
        const dependencies = { validate: jest.fn() }
        const locationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        await locationController.handle(request);

        // THEN
        expect(dependencies.validate).toHaveBeenCalledWith({
          ...request.header,
          ...request.params,
        });
      });

      it('Should return 400 if params Validation fails', async () => {
        // GIVEN
        const locationController = makeController({
          validate: jest.fn().mockReturnValueOnce(new Error())
        });
        const request = makeRequest();

        // WHEN
        const response = await locationController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });

      it('Should call GetLocation with location brand id and location id', async () => {
        // GIVEN
        const dependencies = { get: jest.fn() }
        const locationController = makeController(dependencies);
        const request = makeRequest();
        const { brandId } = request.header;
        const { locationId } = request.params;

        // WHEN
        await locationController.handle(request);

        // THEN
        expect(dependencies.get).toHaveBeenCalledWith(brandId, locationId);
      });

      it("Should return 500 if GetLocation throws an error", async () => {
        // Given
        const error = new Error();
        error.stack = "any_stack";
        const dependencies = {
          get: jest.fn().mockImplementationOnce(() => { throw error }),
        };
        const request = makeRequest();
        const locationController = makeController(dependencies);

        // When
        const response = await locationController.handle(request);

        // Then
        expect(response.statusCode).toEqual(500);
      });

      it("Should return 404 if location was not found", async () => {
        // Given
        const dependencies = {
          get: jest.fn().mockResolvedValueOnce(null),
        };
        const request = makeRequest();
        const locationController = makeController(dependencies);

        // When
        const response = await locationController.handle(request);

        // Then
        expect(response.statusCode).toEqual(404);
      });
      
      it('Should return 200 if location was found', async () => {
        // GIVEN
        const locationController = makeController({});
        const request = makeRequest();

        // WHEN
        const response = await locationController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(200);
      });
    });
  });
});