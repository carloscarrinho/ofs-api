import { AddBrandController } from "../../../../src/presentation/controllers/brand/add-brand-controller";
import { IController } from "../../../../src/presentation/controllers/icontroller";
import { HttpRequest } from "../../../../src/presentation/protocols/http";

const makeController = (): IController => {
  return new AddBrandController();
};

const makeRequest = (data?: object): HttpRequest => ({
  header: {
    "Content-Type": "application/json",
    "x-api-key": "valid-api-key",
  },
  ...data,
});

describe("Unit", () => {
  describe("Presentation::Controllers", () => {
    describe("AddBrandController.handle()", () => {
      it("Should return 400 if API_KEY is missing", async () => {
        // GIVEN
        const brandController = makeController();
        const request = makeRequest({ header: {} });

        // WHEN
        const response = await brandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(400);
      });

      it("Should return 403 if API_KEY is not valid", async () => {
        // GIVEN
        const brandController = makeController();
        const request = makeRequest({
          header: { "x-api-key": "not-valid-api-key" },
        });

        // WHEN
        const response = await brandController.handle(request);

        // THEN
        expect(response.statusCode).toStrictEqual(403);
      });

      it("Should return 200 if everything is OK", async () => {
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
