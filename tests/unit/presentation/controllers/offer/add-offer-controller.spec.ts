import { AddOfferController } from "../../../../../src/presentation/controllers/offer/add-offer-controller";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";
import { IAddOffer } from "../../../../../src/application/use-cases/offer/iadd-offer";

const defaultOfferModel = {
  brandId: "any-brand-id",
  name: "any-brand-name",
  startDate: "2022-04-29T20:41:54.630Z",
  endDate: "2022-05-29T20:41:54.630Z",
  type: {
    value: "any-value",
    name: "any-name"
  }
}

const makeController = ({
  validate,
  add,
}: {
  validate?: Function;
  add?: Function;
}): AddOfferController => {
  const validation = {
    validate: validate ?? jest.fn().mockReturnValueOnce(null),
  } as unknown as IValidation;

  const addOffer = {
    add:
      add ?? jest.fn().mockResolvedValue({ 
        id: "any-offer-id", 
        locationsTotal: 1,
        createdAt: "2022-04-29T20:41:54.630Z", 
        ...defaultOfferModel,
     }),
  } as unknown as IAddOffer;
  
  return new AddOfferController(validation, addOffer);
};

const makeRequest = (data?: object): HttpRequest => ({
  header: {
    "Content-Type": "application/json",
  },
  body: defaultOfferModel,
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

      it("Should call AddOffer with required values", async () => {
        // GIVEN
        const dependencies = { add: jest.fn() };
        const addOfferController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        addOfferController.handle(request);

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
    });
  });
});
