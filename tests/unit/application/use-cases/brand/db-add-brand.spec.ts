import { DbAddBrand } from "../../../../../src/application/use-cases/brand/db-add-brand";
import { IAddBrand } from "../../../../../src/application/use-cases/brand/iadd-brand";
import { IBrandRepository } from "../../../../../src/infrastructure/db/repositories/brand/ibrand-repository";

const brandModel = { name: "any-name" };

const makeDbAddBrand = ({ store }:{ store?: Function }): IAddBrand => {
  const brandRepository = {
    store: store ?? jest.fn().mockResolvedValueOnce({ 
      id: "some-id",
      ...brandModel,
    })
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
    });
  });
});