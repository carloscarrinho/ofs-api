import { AddOfferController } from "../../../../../src/presentation/controllers/offer/add-offer-controller";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";
import { IAddOffer } from "../../../../../src/application/use-cases/offer/iadd-offer";
import { IGetBrand } from "../../../../../src/application/use-cases/brand/iget-brand";
import { generateOfferModel } from "../../../../fixtures/offer/offer-fixture";

const makeController = ({
  validate,
  get,
  add,
}: {
  validate?: Function;
  get?: Function;
  add?: Function;
}): AddOfferController => {
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

  const addOffer = {
    add:
      add ?? jest.fn().mockResolvedValue({ 
        id: "any-offer-id", 
        locationsTotal: 1,
        createdAt: "2022-04-29T20:41:54.630Z", 
        ...generateOfferModel(),
     }),
  } as unknown as IAddOffer;
  
  return new AddOfferController(validation, getBrand, addOffer);
};

const makeRequest = (data?: object): HttpRequest => ({
  header: {
    "Content-Type": "application/json",
  },
  body: generateOfferModel(),
  ...data,
});

describe("Unit", () => {
  describe("Presentation::Controllers", () => {
    describe("AddOfferController.handle()", () => {
      it("Should call Validation with body provided values", async () => {
        // Given
        const dependencies = { validate: jest.fn() };
        const addOfferController = makeController(dependencies);
        const request = makeRequest();

        // When
        await addOfferController.handle(request);

        // Then
        expect(dependencies.validate).toHaveBeenCalledWith(request.body);
      });

      it("Should return 400 if validation returns error", async () => {
        // GIVEN
        const dependencies = {
          validate: jest.fn().mockReturnValueOnce(new Error()),
        };
        const addOfferController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        const response = await addOfferController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });

      it("Should call GetBrand with brand id", async () => {
        // GIVEN
        const dependencies = { get: jest.fn(), add: jest.fn() };
        const addOfferController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        addOfferController.handle(request);

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
        const addOfferController = makeController(dependencies);

        // When
        const response = await addOfferController.handle(request);

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

      it("Should call AddOffer with required values", async () => {
        // GIVEN
        const dependencies = { add: jest.fn() };
        const addOfferController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        await addOfferController.handle(request);

        // THEN
        expect(dependencies.add).toBeCalledWith(request.body);
      });

      it("Should return 500 if AddOffer throws an error", async () => {
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

      it("Should return 200 if added brand successfully", async () => {
        // GIVEN
        const addOfferController = makeController({});
        const request = makeRequest();

        // WHEN
        const response = await addOfferController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(200);
      });
    });
  });
});
