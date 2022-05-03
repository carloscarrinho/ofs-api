import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DBIndexPrefixes } from "../../../../../../src/infrastructure/db/enums/db-index-prefixes";
import { IOfferRepository } from "../../../../../../src/infrastructure/db/repositories/offer/ioffer-repository";
import { DynamoOfferRepository } from "../../../../../../src/infrastructure/db/repositories/offer/dynamo-offer-repository";
import { generateOfferEntity, generateOfferModel } from "../../../../../fixtures/offer/offer-fixture";

const dynamoDb = new DynamoDB({ endpoint: process.env.TABLE_ENDPOINT });

const prepareEnvironment = async () => {
  try {
    const tables = await dynamoDb.listTables().promise();
    const foundTable = tables.TableNames?.some((name: string) =>
      [process.env.TABLE_NAME].includes(name)
    );

    if (foundTable) return;

    await dynamoDb.createTable({
      AttributeDefinitions: [
        { AttributeName: "pk", AttributeType: "S" },
        { AttributeName: "sk", AttributeType: "S" },
        { AttributeName: "gsi1pk", AttributeType: "S" },
        { AttributeName: "gsi1sk", AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "pk", KeyType: "HASH" },
        { AttributeName: "sk", KeyType: "RANGE" },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "gsi1",
          KeySchema: [
            { AttributeName: "gsi1pk", KeyType: "HASH" },
            { AttributeName: "gsi1sk", KeyType: "RANGE" },
          ],
          ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
      TableName: process.env.TABLE_NAME,
    }).promise();
    
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
  return new DynamoOfferRepository({
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  });
};

describe("Integration", () => {
  describe("Infastructure::DB::Repositories::Offer", () => {
    beforeEach(prepareEnvironment);
    afterEach(teardownEnvironment);

    describe("DynamoOfferRepository.store()", () => {  
      it("Should throw an error if DynamoDB throws", async () => {
        // Given
        const offerRepository = makeDynamoOfferRepository();
        // forcing an error because the table does not exists.
        const tables = await dynamoDb.listTables().promise();
        const foundTable = tables.TableNames?.some(
          (name: string) => [process.env.TABLE_NAME].includes(name)
        );
        if(foundTable) {
          await dynamoDb
            .deleteTable({ TableName: process.env.TABLE_NAME })
            .promise();
        }

        // When
        const result = offerRepository.store(generateOfferModel());

        // Then
        await expect(result).rejects.toThrow();
      });

      it("Should return the offer data if offer was stored successfully", async () => {
        // Given
        const dynamoClient = new DocumentClient({
          endpoint: process.env.TABLE_ENDPOINT,
        });
        const offerRepository = makeDynamoOfferRepository();
        const offerModel = generateOfferModel();
        const offerEntity = generateOfferEntity(offerModel);

        // When
        const result = await offerRepository.store(offerEntity);
        const params = {
          TableName: process.env.TABLE_NAME,
          Key: { 
            pk: `${DBIndexPrefixes.OFFER}${offerEntity.id}`, 
            sk: `${DBIndexPrefixes.BRAND}${offerEntity.brandId}`, 
          },
        }
        const record = await dynamoClient.get(params).promise();

        // Then
        expect(result.id).toStrictEqual(offerEntity.id);
        expect(result.name).toStrictEqual(offerEntity.name);
        expect(record.Item.name).toEqual(offerEntity.name);
      });
    });
  });
});
