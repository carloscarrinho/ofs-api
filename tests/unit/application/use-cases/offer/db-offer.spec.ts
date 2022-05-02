import { DbOffer } from "../../../../../src/application/use-cases/offer/db-offer";
import { IOfferRepository } from "../../../../../src/infrastructure/db/repositories/offer/ioffer-repository";
import { generateOfferModel, generateOfferEntity } from "../../../../fixtures/offer/offer-fixture";

const makeDbOffer = ({
  store,
}: {
  store?: Function;
  find?: Function;
}): DbOffer => {
  const offerRepository = {
    store: store ?? jest.fn().mockResolvedValueOnce(generateOfferEntity()),
  } as unknown as IOfferRepository;

  return new DbOffer(offerRepository);
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
    });
  });
});
