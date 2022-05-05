import { LinkLocationController } from "../../../../../src/presentation/controllers/offer/link-location-controller";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";
import { ILinkLocation } from "../../../../../src/application/use-cases/offer/ilink-location";
import { generateLocationEntity } from "../../../../fixtures/location/location-fixture";
import { generateOfferEntity } from "../../../../fixtures/offer/offer-fixture";
import { IGetLocation } from "../../../../../src/application/use-cases/location/iget-location";

const locationEntity = generateLocationEntity();

const makeController = ({
  validate,
  get,
  link,
}: {
  validate?: Function;
  get?: Function;
  link?: Function;
}): LinkLocationController => {
  const validation = {
    validate: validate ?? jest.fn().mockReturnValueOnce(null),
  } as unknown as IValidation;

  const getLocation = {
    get: get ?? jest.fn().mockReturnValueOnce(locationEntity),
  } as unknown as IGetLocation;

  const linkLocation = {
    link: link ?? jest.fn().mockResolvedValue(true),
  } as unknown as ILinkLocation;
  
  return new LinkLocationController(validation, getLocation, linkLocation);
};

const makeRequest = (data?: object): HttpRequest => ({
  header: {
    "Content-Type": "application/json",
  },
  params: {
    offerId: generateOfferEntity().id,
  },
  body: {
    brandId: locationEntity.brandId,
    locationId: locationEntity.id,
  },
  ...data,
});

describe("Unit", () => {
  describe("Presentation::Controllers", () => {
    describe("LinkLocationController.handle()", () => {
      it("Should call Validation with required values for link location", async () => {
        // Given
        const dependencies = { validate: jest.fn() };
        const linkLocationController = makeController(dependencies);
        const request = makeRequest();

        // When
        await linkLocationController.handle(request);

        // Then
        expect(dependencies.validate).toHaveBeenCalledWith({
          ...request.params,
          ...request.body
        });
      });

      it("Should return 400 if validation returns error", async () => {
        // GIVEN
        const dependencies = {
          validate: jest.fn().mockReturnValueOnce(new Error()),
        };
        const linkLocationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        const response = await linkLocationController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });

      it("Should call GetLocation with brand and location ids", async () => {
        // GIVEN
        const dependencies = { get: jest.fn(), link: jest.fn() };
        const linkLocationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        linkLocationController.handle(request);

        // THEN
        expect(dependencies.get).toBeCalledWith(
          request.body.brandId,
          request.body.locationId
        );
        expect(dependencies.link).not.toBeCalled();
      });

      it("Should return 404 if GetLocation returns null", async () => {
        // Given
        const dependencies = {
          get: jest.fn().mockResolvedValueOnce(null),
          link: jest.fn(),
        };
        const request = makeRequest();
        const linkLocationController = makeController(dependencies);

        // When
        const response = await linkLocationController.handle(request);

        // Then
        expect(response.statusCode).toEqual(404);
        expect(dependencies.link).not.toBeCalled();
      });

      it("Should return 500 if GetLocation throws an error", async () => {
        // GIVEN
        const error = new Error();
        error.stack = "any_stack";

        const dependencies = {
          get: jest.fn().mockImplementationOnce(() => {
            throw error;
          }),
          link: jest.fn(),
        };
        const linkLocationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        const response = await linkLocationController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(500);
        expect(dependencies.link).not.toBeCalled();
      });

      it("Should call LinkLocation with required values", async () => {
        // GIVEN
        const dependencies = { link: jest.fn() };
        const linkLocationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        await linkLocationController.handle(request);

        // THEN
        expect(dependencies.link).toBeCalledWith({
          offerId: request.params.offerId,
          brandId: request.body.brandId,
          locationId: request.body.locationId,
        });
      });

      it("Should return 500 if LinkLocation throws an error", async () => {
        // GIVEN
        const error = new Error();
        error.stack = "any_stack";

        const dependencies = {
          link: jest.fn().mockImplementationOnce(() => {
            throw error;
          }),
        };
        const linkLocationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        const response = await linkLocationController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(500);
      });

      it("Should return 200 if linked location successfully", async () => {
        // GIVEN
        const linkLocationController = makeController({});
        const request = makeRequest();

        // WHEN
        const response = await linkLocationController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(200);
      });
    });
  });
});
