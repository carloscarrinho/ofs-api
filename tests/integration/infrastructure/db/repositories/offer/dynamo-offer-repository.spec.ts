import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DBIndexPrefixes } from "../../../../../../src/infrastructure/db/enums/db-index-prefixes";
import { IOfferRepository } from "../../../../../../src/infrastructure/db/repositories/offer/ioffer-repository";
import { DynamoOfferRepository } from "../../../../../../src/infrastructure/db/repositories/offer/dynamo-offer-repository";
import { generateOfferEntity, generateOfferModel } from "../../../../../fixtures/offer/offer-fixture";
import { generateBrandEntity } from "../../../../../fixtures/brand/brand-fixture";
import { generateLinkLocationModel } from "../../../../../fixtures/offer/link-location-fixture";
import { generateLocationEntity } from "../../../../../fixtures/location/location-fixture";

const offerEntity = generateOfferEntity();
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
            pk: `${DBIndexPrefixes.BRAND}${offerEntity.brandId}`, 
            sk: `${DBIndexPrefixes.OFFER}${offerEntity.id}`, 
          },
        }
        const record = await dynamoClient.get(params).promise();

        // Then
        expect(result.id).toStrictEqual(offerEntity.id);
        expect(result.name).toStrictEqual(offerEntity.name);
        expect(record.Item.name).toEqual(offerEntity.name);
      });
    });

    describe("DynamoOfferRepository.find()", () => {
      it("Should throw an error if DynamoDB throws", async () => {
        // Given
        const offerRepository = makeDynamoOfferRepository();
        // forcing an error because the table does not exists.
        const tables = await dynamoDb.listTables().promise();
        const foundTable = tables.TableNames?.some((name: string) =>
          [process.env.TABLE_NAME].includes(name)
        );
        if (foundTable) {
          await dynamoDb
            .deleteTable({ TableName: process.env.TABLE_NAME })
            .promise();
        }

        // When
        const result = offerRepository.find(
          offerEntity.brandId,
          offerEntity.id
        );

        // Then
        await expect(result).rejects.toThrow();
      });

      it("Should return the offer data if offer was found successfully", async () => {
        // Given
        const dynamoClient = new DocumentClient({
          endpoint: process.env.TABLE_ENDPOINT,
        });

        const offerRepository = makeDynamoOfferRepository();

        // storing brand
        await dynamoClient
          .put({
            TableName: process.env.TABLE_NAME,
            Item: {
              ...offerEntity,
              pk: `${DBIndexPrefixes.BRAND}${offerEntity.brandId}`,
              sk: `${DBIndexPrefixes.BRAND}${offerEntity.brandId}`,
            },
          })
          .promise();
        
          // storing offer
        await dynamoClient
          .put({
            TableName: process.env.TABLE_NAME,
            Item: {
              ...offerEntity,
              pk: `${DBIndexPrefixes.BRAND}${offerEntity.brandId}`,
              sk: `${DBIndexPrefixes.OFFER}${offerEntity.id}`,
            },
          })
          .promise();

        // When
        const result = await offerRepository.find(
          offerEntity.brandId, 
          offerEntity.id
        );

        // Then
        expect(result.id).toStrictEqual(offerEntity.id);
      });
    });
    
    describe("DynamoOfferRepository.linkLocation()", () => {  
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
        const result = offerRepository.linkLocation(generateLinkLocationModel());

        // Then
        await expect(result).rejects.toThrow();
      });

      it("Should return TRUE if location was linked successfully", async () => {
        // Given
        const dynamoClient = new DocumentClient({
          endpoint: process.env.TABLE_ENDPOINT,
        });
        const offerRepository = makeDynamoOfferRepository();
        const brandEntity = generateBrandEntity();
        const locationEntity = generateLocationEntity({ brandId: brandEntity.id });
        const offerEntity = generateOfferEntity({ brandId: brandEntity.id });
        const linkLocationModel = generateLinkLocationModel();

        // storing brand
        await dynamoClient
          .put({
            TableName: process.env.TABLE_NAME,
            Item: {
              ...locationEntity,
              pk: `${DBIndexPrefixes.BRAND}${brandEntity.id}`,
              sk: `${DBIndexPrefixes.BRAND}${brandEntity.id}`,
            },
          })
          .promise();
        
          // storing location
        await dynamoClient
          .put({
            TableName: process.env.TABLE_NAME,
            Item: {
              ...generateLocationEntity(),
              pk: `${DBIndexPrefixes.BRAND}${locationEntity.brandId}`,
              sk: `${DBIndexPrefixes.LOCATION}${locationEntity.id}`,
            },
          })
          .promise();

        // storing offer
        await dynamoClient
          .put({
            TableName: process.env.TABLE_NAME,
            Item: {
              ...offerEntity,
              pk: `${DBIndexPrefixes.BRAND}${offerEntity.brandId}`,
              sk: `${DBIndexPrefixes.OFFER}${offerEntity.id}`,
            },
          })
          .promise();

        // When
        const result = await offerRepository.linkLocation(linkLocationModel);
        const params = {
          TableName: process.env.TABLE_NAME,
          Key: { 
            pk: `${DBIndexPrefixes.BRAND}${offerEntity.brandId}`, 
            sk: `${DBIndexPrefixes.OFFER}${offerEntity.id}`, 
          },
        }
        const record = await dynamoClient.get(params).promise();

        // Then
        expect(result).toBeTruthy();
        expect(record.Item.locationsTotal).toBe(1);
      });
    });
  });
});
