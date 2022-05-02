import { AddOfferController } from "../../../../../src/presentation/controllers/offer/add-offer-controller";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";

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

  return new AddOfferController(validation);
};

const makeRequest = (data?: object): HttpRequest => ({
  header: {
    "Content-Type": "application/json",
  },
  body: {
    brandId: "any-brand-id",
    name: "any-brand-name",
    startDate: "2022-04-29T20:41:54.630Z",
    endDate: "2022-05-29T20:41:54.630Z",
    type: {
      value: "any-value",
      name: "any-name"
    }
  },
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
        const addBrandController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        const response = await addBrandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });
    });
  });
});
