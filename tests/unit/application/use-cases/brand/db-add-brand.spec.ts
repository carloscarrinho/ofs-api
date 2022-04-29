import { DbAddBrand } from "../../../../../src/application/use-cases/brand/db-add-brand";
import { IAddBrand } from "../../../../../src/application/use-cases/brand/iadd-brand";
import { IBrandRepository } from "../../../../../src/infrastructure/db/repositories/brand/ibrand-repository";

const brandModel = { name: "any-name" };
const newBrandData = { id: "some-id", ...brandModel };

const makeDbAddBrand = ({ store }:{ store?: Function }): IAddBrand => {
  const brandRepository = {
    store: store ?? jest.fn().mockResolvedValueOnce(newBrandData)
  } as unknown as IBrandRepository;

  return new DbAddBrand(brandRepository);
}

describe('Unit', () => {
  describe('Application::UseCases::Brand', () => {
    describe('DbAddBrand.add()', () => {
      it('Should call BrandRepository with required data', async () => {
        // GIVEN
        const dependencies = { store: jest.fn() };
        const dbAddBrand = makeDbAddBrand(dependencies);

        // WHEN
        await dbAddBrand.add(brandModel);

        // THEN
        expect(dependencies.store).toBeCalledWith(brandModel);
      });

      it("Should throw an error if BrandRepository throws", async () => {
        // Given
        const dependencies = {
          store: jest.fn().mockImplementationOnce(() => {
            throw new Error();
          }),
        };
        const dbAddBrand = makeDbAddBrand(dependencies);

        // When
        const brand = dbAddBrand.add(brandModel);

        // Then
        await expect(brand).rejects.toThrow();
      });

      it("Should return a Brand if store succeeds", async () => {
        // Given
        const dbAddBrand = makeDbAddBrand({});

        // When
        const brand = await dbAddBrand.add(brandModel);

        // Then
        expect(brand).toStrictEqual(newBrandData);
      });
    });
  });
});