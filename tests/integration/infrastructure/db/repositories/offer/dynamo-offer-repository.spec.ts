import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DBIndexPrefixes } from "../../../../../../src/infrastructure/db/enums/db-index-prefixes";
import { IOfferRepository } from "../../../../../../src/infrastructure/db/repositories/offer/ioffer-repository";
import { DynamoOfferRepository } from "../../../../../../src/infrastructure/db/repositories/offer/dynamo-offer-repository";
import { tableModel } from "../../../../../../src/infrastructure/db/settings/table-model";
import { generateOfferModel } from "../../../../../fixtures/offer/offer-fixture";

const dynamoDb = new DynamoDB({ endpoint: process.env.TABLE_ENDPOINT });

const prepareEnvironment = async () => {
  try {
    const tables = await dynamoDb.listTables().promise();
    const foundTable = tables.TableNames?.some((name: string) =>
      [process.env.TABLE_NAME].includes(name)
    );

    if (foundTable) return;

    await dynamoDb
      .createTable(tableModel)
      .promise();
  } catch (error) {
    console.log(error);
  }
};

const teardownEnvironment = async () => {
  try {
    const tables = await dynamoDb.listTables().promise();
    const foundTable = tables.TableNames?.some((name: string) =>
      [process.env.TABLE_NAME].includes(name)
    );

    if (!foundTable) return;

    await dynamoDb.deleteTable({ TableName: process.env.TABLE_NAME }).promise();
  } catch (error) {
    console.log(error);
  }
};

const makeDynamoOfferRepository = (): IOfferRepository => {
  const settings = {
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  };

  return new DynamoOfferRepository(settings);
};

describe("Integration", () => {
  describe("Infastructure::DB::Repositories::Offer", () => {
    beforeEach(prepareEnvironment);
    afterEach(teardownEnvironment);

    describe("DynamoOfferRepository.store()", () => {
      it("Should throw an error if DynamoDB throws", async () => {
        // Given
        // forcing an error because the table does not exists.
        await dynamoDb
          .deleteTable({ TableName: process.env.TABLE_NAME })
          .promise();
        const offerRepository = makeDynamoOfferRepository();

        // When
        const result = offerRepository.store(generateOfferModel());

        // Then
        await expect(result).rejects.toThrow();
      });
    });
  });
});
