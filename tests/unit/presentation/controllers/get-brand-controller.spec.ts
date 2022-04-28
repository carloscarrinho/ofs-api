import { GetBrandController } from "../../../../src/presentation/controllers/brand/get-brand-controller";
import { IController } from "../../../../src/presentation/controllers/icontroller";
import { HttpRequest } from "../../../../src/presentation/protocols/http";

const makeController = (): IController => {
  return new GetBrandController();
}

const makeRequest = (data?: object): HttpRequest => ({
  header: { "Content-Type": "application/json" },
  ...data,
});

describe('Unit', () => {
  describe('Presentation::Controllers', () => {
    describe('GetBrandController.handle()', () => {
      it('Should return 200 if everything is OK', async () => {
        // GIVEN
        const brandController = makeController();
        const request = makeRequest();

        // WHEN
        const response = await brandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(200);
      });
    });
  });
});