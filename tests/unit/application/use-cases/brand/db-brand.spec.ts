import { DbBrand } from "../../../../../src/application/use-cases/brand/db-brand";
import { IBrandRepository } from "../../../../../src/infrastructure/db/repositories/brand/ibrand-repository";

const brandModel = { name: "any-name" };
const defaultBrandData = { 
  id: "some-id", 
  ...brandModel,
  createdAt: "2022-04-29T10:00:00", 
};

const makeDbBrand = ({ 
  store, 
  find 
}:{ 
  store?: Function, 
  find?: Function, 
}): DbBrand => {
  const brandRepository = {
    store: store ?? jest.fn().mockResolvedValueOnce(defaultBrandData),
    find: find ?? jest.fn().mockResolvedValueOnce(defaultBrandData),
  } as unknown as IBrandRepository;

  return new DbBrand(brandRepository);
}

describe('Unit', () => {
  describe('Application::UseCases::Brand', () => {
    describe('DbBrand.add()', () => {
      it('Should call BrandRepository with required data', async () => {
        // GIVEN
        const dependencies = { store: jest.fn() };
        const DbBrand = makeDbBrand(dependencies);

        // WHEN
        await DbBrand.add(brandModel);

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
        const DbBrand = makeDbBrand(dependencies);

        // When
        const brand = DbBrand.add(brandModel);

        // Then
        await expect(brand).rejects.toThrow();
      });

      it("Should return a Brand if store succeeds", async () => {
        // Given
        const DbBrand = makeDbBrand({});

        // When
        const brand = await DbBrand.add(brandModel);

        // Then
        expect(brand).toStrictEqual(defaultBrandData);
      });
    });

    describe('DbBrand.get()', () => {
      it('Should call BrandRepository with brand id', async () => {
        // GIVEN
        const dependencies = { find: jest.fn() };
        const dbBrand = makeDbBrand(dependencies);

        // WHEN
        await dbBrand.get(defaultBrandData.id);

        // THEN
        expect(dependencies.find).toBeCalledWith(defaultBrandData.id);
      });

      it("Should throw an error if BrandRepository throws", async () => {
        // Given
        const dependencies = {
          find: jest.fn().mockImplementationOnce(() => {
            throw new Error();
          }),
        };
        const DbBrand = makeDbBrand(dependencies);

        // When
        const brand = DbBrand.get(defaultBrandData.id);

        // Then
        await expect(brand).rejects.toThrow();
      });

      it("Should return null if brand was not found", async () => {
        // Given
        const dependencies = { find: jest.fn().mockResolvedValueOnce(null) };
        const DbBrand = makeDbBrand(dependencies);

        // When
        const brand = await DbBrand.get(defaultBrandData.id);

        // Then
        expect(brand).toBeFalsy();
      });
      
      it("Should return null if brand was not found", async () => {
        // Given
        const DbBrand = makeDbBrand({});

        // When
        const brand = await DbBrand.get(defaultBrandData.id);

        // Then
        expect(brand).toEqual(defaultBrandData);
      });
    });
  });
});