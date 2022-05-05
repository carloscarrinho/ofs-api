import { GetOfferController } from "../../../../../src/presentation/controllers/offer/get-offer-controller";
import { IController } from "../../../../../src/presentation/controllers/icontroller";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { IGetOffer } from "../../../../../src/application/use-cases/offer/iget-offer";
import { generateOfferEntity } from "../../../../fixtures/offer/offer-fixture";
import { generateBrandEntity } from "../../../../fixtures/brand/brand-fixture";

const brandEntity = generateBrandEntity();
const offerEntity = generateOfferEntity({ brandId: brandEntity.id });

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

  const getOffer = {
    get: get ?? jest.fn().mockReturnValueOnce(offerEntity),
  } as unknown as IGetOffer;

  return new GetOfferController(validation, getOffer);
}

const makeRequest = (data?: Partial<HttpRequest>): HttpRequest => ({
  header: { brandId: brandEntity.id },
  params: { offerId: offerEntity.id },
  ...data,
});

describe('Unit', () => {
  describe('Presentation::Controllers', () => {
    describe('GetOfferController.handle()', () => {
      it('Should call Validation with request params', async () => {
        // GIVEN
        const dependencies = { validate: jest.fn() }
        const offerController = makeController(dependencies);
        const request = makeRequest()

        // WHEN
        await offerController.handle(request);

        // THEN
        expect(dependencies.validate).toHaveBeenCalledWith({
          ...request.header,
          ...request.params
        });
      });

      it('Should return 400 if params Validation fails', async () => {
        // GIVEN
        const offerController = makeController({
          validate: jest.fn().mockReturnValueOnce(new Error())
        });
        const request = makeRequest();

        // WHEN
        const response = await offerController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });

      it('Should call GetOffer with offer id', async () => {
        // GIVEN
        const dependencies = { get: jest.fn() }
        const offerController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        await offerController.handle(request);

        // THEN
        expect(dependencies.get).toHaveBeenCalledWith(
          request.header.brandId,
          request.params.offerId
        );
      });

      it("Should return 500 if GetOffer throws an error", async () => {
        // Given
        const error = new Error();
        error.stack = "any_stack";
        const dependencies = {
          get: jest.fn().mockImplementationOnce(() => { throw error }),
        };
        const request = makeRequest();
        const offerController = makeController(dependencies);

        // When
        const response = await offerController.handle(request);

        // Then
        expect(response.statusCode).toEqual(500);
      });

      it("Should return 404 if offer id is invalid", async () => {
        // Given
        const dependencies = {
          get: jest.fn().mockResolvedValueOnce(null),
        };
        const request = makeRequest();
        const offerController = makeController(dependencies);

        // When
        const response = await offerController.handle(request);

        // Then
        expect(response.statusCode).toEqual(404);
      });
      
      it('Should return 200 if was found', async () => {
        // GIVEN
        const offerController = makeController({});
        const request = makeRequest();

        // WHEN
        const response = await offerController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(200);
      });
    });
  });
});