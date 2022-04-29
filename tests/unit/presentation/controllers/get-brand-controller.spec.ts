import { GetBrandController } from "../../../../src/presentation/controllers/brand/get-brand-controller";
import { IController } from "../../../../src/presentation/controllers/icontroller";
import { HttpRequest } from "../../../../src/presentation/protocols/http";
import { IValidation } from "../../../../src/presentation/validators/ivalidation";

const makeController = ({
  validate
}:{
  validate?: Function
}): IController => {
  const validation = {
    validate: validate ?? jest.fn().mockReturnValueOnce(null),
  } as unknown as IValidation;

  return new GetBrandController(validation);
}

const makeRequest = (data?: object): HttpRequest => ({
  header: { "Content-Type": "application/json" },
  ...data,
});

describe('Unit', () => {
  describe('Presentation::Controllers', () => {
    describe('GetBrandController.handle()', () => {
      it('Should call Validation with params provided by request', async () => {
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
        const request = makeRequest({
          params: { brandId: "some-id" }
        });

        // WHEN
        const response = await brandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });
      
      it('Should return 200 if everything is OK', async () => {
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