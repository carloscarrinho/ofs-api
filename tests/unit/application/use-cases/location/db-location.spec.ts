import { DbLocation } from "../../../../../src/application/use-cases/location/db-location";
import { ILocationRepository } from "../../../../../src/infrastructure/db/repositories/location/ilocation-repository";
import { generateLocationModel, generateLocationEntity } from "../../../../fixtures/location/location-fixture";

const makeDbLocation = ({
  store,
}: {
  store?: Function;
  find?: Function;
}): DbLocation => {
  const locationRepository = {
    store: store ?? jest.fn().mockResolvedValueOnce(generateLocationEntity()),
  } as unknown as ILocationRepository;

  return new DbLocation(locationRepository);
};

describe("Unit", () => {
  describe("Application::UseCases::Location", () => {
    describe("DbLocation.add()", () => {
      it("Should call LocationRepository with required data", async () => {
        // GIVEN
        const dependencies = { store: jest.fn() };
        const DbLocation = makeDbLocation(dependencies);

        // WHEN
        await DbLocation.add(generateLocationModel());

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
        const DbLocation = makeDbLocation(dependencies);

        // When
        const location = DbLocation.add(generateLocationModel());

        // Then
        await expect(location).rejects.toThrow();
      });

      it("Should return a location if store succeeds", async () => {
        // Given
        const DbLocation = makeDbLocation({});

        // When
        const location = await DbLocation.add(generateLocationModel());

        // Then
        expect(location).toStrictEqual(generateLocationEntity());
      });
    });
  });
});
