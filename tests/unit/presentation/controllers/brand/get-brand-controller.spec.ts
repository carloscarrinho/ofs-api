import { GetBrandController } from "../../../../../src/presentation/controllers/brand/get-brand-controller";
import { IController } from "../../../../../src/presentation/controllers/icontroller";
import { HttpRequest } from "../../../../../src/presentation/protocols/http";
import { IValidation } from "../../../../../src/presentation/validators/ivalidation";
import { IGetBrand } from "../../../../../src/application/use-cases/brand/iget-brand";

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

  const getBrand = {
    get: get ?? jest.fn().mockReturnValueOnce({ 
      id: "some-id", 
      name: "any-name",
      createdAt: "2022-04-29T10:00:00"
    }),
  } as unknown as IGetBrand;

  return new GetBrandController(validation, getBrand);
}

const makeRequest = (data?: object): HttpRequest => ({
  header: { "Content-Type": "application/json" },
  params: { brandId: "some-id"},
  ...data,
});

describe('Unit', () => {
  describe('Presentation::Controllers', () => {
    describe('GetBrandController.handle()', () => {
      it('Should call Validation with request params', async () => {
        // GIVEN
        const dependencies = { validate: jest.fn() }
        const brandController = makeController(dependencies);
        const request = makeRequest({
          params: { brandId: "some-id" }
        });

        // WHEN
        await brandController.handle(request);

        // THEN
        expect(dependencies.validate).toHaveBeenCalledWith(request.params);
      });

      it('Should return 400 if params Validation fails', async () => {
        // GIVEN
        const brandController = makeController({
          validate: jest.fn().mockReturnValueOnce(new Error())
        });
        const request = makeRequest();

        // WHEN
        const response = await brandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });

      it('Should call GetBrand with brand id', async () => {
        // GIVEN
        const dependencies = { get: jest.fn() }
        const brandController = makeController(dependencies);
        const request = makeRequest();

        // WHEN
        await brandController.handle(request);

        // THEN
        expect(dependencies.get).toHaveBeenCalledWith(request.params.brandId);
      });

      it("Should return 500 if GetBrand throws an error", async () => {
        // Given
        const error = new Error();
        error.stack = "any_stack";
        const dependencies = {
          get: jest.fn().mockImplementationOnce(() => { throw error }),
        };
        const request = makeRequest();
        const brandController = makeController(dependencies);

        // When
        const response = await brandController.handle(request);

        // Then
        expect(response.statusCode).toEqual(500);
      });

      it("Should return 404 if brand id is invalid", async () => {
        // Given
        const dependencies = {
          get: jest.fn().mockResolvedValueOnce(null),
        };
        const request = makeRequest();
        const brandController = makeController(dependencies);

        // When
        const response = await brandController.handle(request);

        // Then
        expect(response.statusCode).toEqual(404);
      });
      
      it('Should return 200 if was found', async () => {
        // GIVEN
        const brandController = makeController({});
        const request = makeRequest({
          params: { brandId: "some-id" }
        });

        // WHEN
        const response = await brandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(200);
      });
    });
  });
});