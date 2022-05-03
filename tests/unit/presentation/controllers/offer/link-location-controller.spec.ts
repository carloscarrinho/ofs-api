import { LinkLocationController } from "../../../../../src/presentation/controllers/offer/link-location-controller";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";
import { ILinkLocation } from "../../../../../src/application/use-cases/offer/ilink-location";
import { IGetBrand } from "../../../../../src/application/use-cases/brand/iget-brand";
import { generateOfferEntity, generateOfferModel } from "../../../../fixtures/offer/offer-fixture";

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

  const getBrand = {
    get: get ?? jest.fn().mockReturnValueOnce({ 
      id: "some-id", 
      name: "any-name",
      createdAt: "2022-04-29T10:00:00"
    }),
  } as unknown as IGetBrand;

  const linkLocation = {
    link:
      link ?? jest.fn().mockResolvedValue({ 
        ...generateOfferEntity(),
     }),
  } as unknown as ILinkLocation;
  
  return new LinkLocationController(validation, getBrand, linkLocation);
};

const makeRequest = (data?: object): HttpRequest => ({
  header: {
    "Content-Type": "application/json",
  },
  params: {
    "offerId": "any-offer-id",
  },
  body: {
    "brandId": "any-brand-id",
    "locationId": "any-location-id",
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

      it("Should call GetBrand with brand id", async () => {
        // GIVEN
        const dependencies = { get: jest.fn(), link: jest.fn() };
        const linkLocationController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        linkLocationController.handle(request);

        // THEN
        expect(dependencies.get).toBeCalledWith(request.body.brandId);
        expect(dependencies.link).not.toBeCalled();
      });

      it("Should return 404 if brand id is invalid", async () => {
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

      it("Should return 500 if GetBrand throws an error", async () => {
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
