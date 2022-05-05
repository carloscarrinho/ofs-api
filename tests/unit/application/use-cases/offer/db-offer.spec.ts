import { DbOffer } from "../../../../../src/application/use-cases/offer/db-offer";
import { IOfferRepository } from "../../../../../src/infrastructure/db/repositories/offer/ioffer-repository";
import { generateOfferModel, generateOfferEntity } from "../../../../fixtures/offer/offer-fixture";
import { generateLinkLocationModel } from "../../../../fixtures/offer/link-location-fixture";
import { ILocationRepository } from "../../../../../src/infrastructure/db/repositories/location/ilocation-repository";

const makeDbOffer = ({
  store,
  linkLocation,
  linkOffer,
}: {
  store?: Function;
  linkLocation?: Function;
  linkOffer?: Function;
}): DbOffer => {
  const offerRepository = {
    store: store ?? jest.fn().mockResolvedValueOnce(generateOfferEntity()),
    linkLocation: linkLocation ?? jest.fn().mockResolvedValueOnce(true),
  } as unknown as IOfferRepository;
  
  const locationRepository = {
    linkOffer: linkOffer ?? jest.fn().mockResolvedValueOnce(true),
  } as unknown as ILocationRepository;

  return new DbOffer(offerRepository, locationRepository);
};

describe("Unit", () => {
  describe("Application::UseCases::Offer", () => {
    describe("DbOffer.add()", () => {
      it("Should call OfferRepository with required data", async () => {
        // GIVEN
        const dependencies = { store: jest.fn() };
        const DbOffer = makeDbOffer(dependencies);

        // WHEN
        await DbOffer.add(generateOfferModel());

        // THEN
        expect(dependencies.store).toBeCalledWith(generateOfferModel());
      });

      it("Should throw an error if OfferRepository throws", async () => {
        // Given
        const dependencies = {
          store: jest.fn().mockImplementationOnce(() => {
            throw new Error();
          }),
        };
        const DbOffer = makeDbOffer(dependencies);

        // When
        const brand = DbOffer.add(generateOfferModel());

        // Then
        await expect(brand).rejects.toThrow();
      });

      it("Should return an Offer if store succeeds", async () => {
        // Given
        const DbOffer = makeDbOffer({});

        // When
        const brand = await DbOffer.add(generateOfferModel());

        // Then
        expect(brand).toStrictEqual(generateOfferEntity());
      });
    });

    describe("DbOffer.link()", () => {
      it("Should call OfferRepository with required data", async () => {
        // GIVEN
        const dependencies = { linkLocation: jest.fn() };
        const DbOffer = makeDbOffer(dependencies);
        const linkLocationModel = generateLinkLocationModel();

        // WHEN
        await DbOffer.link(linkLocationModel);

        // THEN
        expect(dependencies.linkLocation).toBeCalledWith(linkLocationModel);
      });

      it("Should throw an error if OfferRepository throws", async () => {
        // Given
        const dependencies = {
          linkLocation: jest.fn().mockImplementationOnce(() => {
            throw new Error();
          }),
        };
        const DbOffer = makeDbOffer(dependencies);

        // When
        const offer = DbOffer.link(generateLinkLocationModel());

        // Then
        await expect(offer).rejects.toThrow();
      });

      it("Should return FALSE if OfferRepository returns FALSE", async () => {
        // Given
        const dependencies = {
          linkLocation: jest.fn().mockReturnValueOnce(false),
        };

        const DbOffer = makeDbOffer(dependencies);

        // When
        const offer = await DbOffer.link(generateLinkLocationModel());

        // Then
        expect(offer).toBe(false);
      });

      it("Should call LocationRepository with required data", async () => {
        // GIVEN
        const dependencies = { linkOffer: jest.fn() };
        const DbOffer = makeDbOffer(dependencies);
        const linkLocationModel = generateLinkLocationModel();

        // WHEN
        await DbOffer.link(linkLocationModel);

        // THEN
        expect(dependencies.linkOffer).toBeCalledWith(
          linkLocationModel.brandId,
          linkLocationModel.locationId,
        );
      });

      it("Should throw an error if LocationRepository throws", async () => {
        // Given
        const dependencies = {
          linkOffer: jest.fn().mockImplementationOnce(() => {
            throw new Error();
          }),
        };
        const DbOffer = makeDbOffer(dependencies);

        // When
        const offer = DbOffer.link(generateLinkLocationModel());

        // Then
        await expect(offer).rejects.toThrow();
      });

      it("Should return TRUE if link location proccess succeeds", async () => {
        // Given
        const DbOffer = makeDbOffer({});

        // When
        const offer = await DbOffer.link(generateLinkLocationModel());

        // Then
        expect(offer).toBe(true);
      });
    });
  });
});
