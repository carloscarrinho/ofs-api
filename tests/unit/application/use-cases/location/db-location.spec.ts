import { DbLocation } from "../../../../../src/application/use-cases/location/db-location";
import { ILocationRepository } from "../../../../../src/infrastructure/db/repositories/location/ilocation-repository";
import {
  generateLocationModel,
  generateLocationEntity,
} from "../../../../fixtures/location/location-fixture";

const locationEntity = generateLocationEntity();

const makeDbLocation = ({
  store,
  find,
}: {
  store?: Function;
  find?: Function;
}): DbLocation => {
  const locationRepository = {
    store: store ?? jest.fn().mockResolvedValueOnce(locationEntity),
    find: find ?? jest.fn().mockResolvedValueOnce(locationEntity),
  } as unknown as ILocationRepository;

  return new DbLocation(locationRepository);
};

describe("Unit", () => {
  describe("Application::UseCases::Location", () => {
    describe("DbLocation.add()", () => {
      it("Should call LocationRepository with required data", async () => {
        // GIVEN
        const dependencies = { store: jest.fn() };
        const dbLocation = makeDbLocation(dependencies);

        // WHEN
        await dbLocation.add(generateLocationModel());

        // THEN
        expect(dependencies.store).toBeCalledWith(generateLocationModel());
      });

      it("Should throw an error if LocationRepository throws", async () => {
        // Given
        const dependencies = {
          store: jest.fn().mockImplementationOnce(() => {
            throw new Error();
          }),
        };
        const dbLocation = makeDbLocation(dependencies);

        // When
        const location = dbLocation.add(generateLocationModel());

        // Then
        await expect(location).rejects.toThrow();
      });

      it("Should return a location if store succeeds", async () => {
        // Given
        const dbLocation = makeDbLocation({});

        // When
        const location = await dbLocation.add(generateLocationModel());

        // Then
        expect(location).toStrictEqual(generateLocationEntity());
      });
    });

    describe("DbLocation.find()", () => {
      it("Should call LocationRepository with required data", async () => {
        // GIVEN
        const dependencies = { find: jest.fn() };
        const dbLocation = makeDbLocation(dependencies);

        // WHEN
        await dbLocation.get(locationEntity.brandId, locationEntity.id);

        // THEN
        expect(dependencies.find).toBeCalledWith(locationEntity.brandId, locationEntity.id);
      });

      it("Should throw an error if LocationRepository throws", async () => {
        // Given
        const dependencies = {
          find: jest.fn().mockImplementationOnce(() => {
            throw new Error();
          }),
        };
        const dbLocation = makeDbLocation(dependencies);

        // When
        const location = dbLocation.get(
          locationEntity.brandId,
          locationEntity.id
        );

        // Then
        await expect(location).rejects.toThrow();
      });

      it("Should return the location if found location", async () => {
        // Given
        const dbLocation = makeDbLocation({});

        // When
        const location = await dbLocation.get(
          locationEntity.brandId,
          locationEntity.id
        );

        // Then
        expect(location).toStrictEqual(locationEntity);
      });
    });
  });
});
