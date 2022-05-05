import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DBIndexPrefixes } from "../../../../../../src/infrastructure/db/enums/db-index-prefixes";
import { ILocationRepository } from "../../../../../../src/infrastructure/db/repositories/location/ilocation-repository";
import { DynamoLocationRepository } from "../../../../../../src/infrastructure/db/repositories/location/dynamo-location-repository";
import {
  generateLocationEntity,
  generateLocationModel,
} from "../../../../../fixtures/location/location-fixture";
import {
  generateBrandEntity,
} from "../../../../../fixtures/brand/brand-fixture";

const dynamoDb = new DynamoDB({ endpoint: process.env.TABLE_ENDPOINT });
const locationEntity = generateLocationEntity({ brandId: generateBrandEntity().id });

const prepareEnvironment = async () => {
  try {
    const tables = await dynamoDb.listTables().promise();
    const foundTable = tables.TableNames?.some((name: string) =>
      [process.env.TABLE_NAME].includes(name)
    );

    if (foundTable) return;

    await dynamoDb
      .createTable({
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
            ProvisionedThroughput: {
              ReadCapacityUnits: 10,
              WriteCapacityUnits: 10,
            },
            Projection: {
              ProjectionType: "ALL",
            },
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10,
        },
        TableName: process.env.TABLE_NAME,
      })
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

const makeDynamoLocationRepository = (): ILocationRepository => {
  return new DynamoLocationRepository({
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  });
};

describe("Integration", () => {
  describe("Infastructure::DB::Repositories::Location", () => {
    beforeEach(prepareEnvironment);
    afterEach(teardownEnvironment);

    describe("DynamoLocationRepository.store()", () => {
      it("Should throw an error if DynamoDB throws", async () => {
        // Given
        const locationRepository = makeDynamoLocationRepository();
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
        const result = locationRepository.store(generateLocationModel());

        // Then
        await expect(result).rejects.toThrow();
      });

      it("Should return the location data if location was stored successfully", async () => {
        // Given
        const dynamoClient = new DocumentClient({
          endpoint: process.env.TABLE_ENDPOINT,
        });
        const locationRepository = makeDynamoLocationRepository();
        const locationModel = generateLocationModel();
        const locationEntity = generateLocationEntity(locationModel);

        // When
        const result = await locationRepository.store(locationEntity);
        const params = {
          TableName: process.env.TABLE_NAME,
          Key: {
            pk: `${DBIndexPrefixes.BRAND}${locationEntity.brandId}`,
            sk: `${DBIndexPrefixes.LOCATION}${locationEntity.id}`,
          },
        };
        const record = await dynamoClient.get(params).promise();

        // Then
        expect(result.id).toStrictEqual(locationEntity.id);
        expect(result.address).toStrictEqual(locationEntity.address);
        expect(record.Item.address).toEqual(locationEntity.address);
      });
    });

    describe("DynamoLocationRepository.find()", () => {
      it("Should throw an error if DynamoDB throws", async () => {
        // Given
        const locationRepository = makeDynamoLocationRepository();
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
        const result = locationRepository.find(
          locationEntity.brandId,
          locationEntity.id
        );

        // Then
        await expect(result).rejects.toThrow();
      });

      it("Should return the location data if location was found successfully", async () => {
        // Given
        const dynamoClient = new DocumentClient({
          endpoint: process.env.TABLE_ENDPOINT,
        });

        const locationRepository = makeDynamoLocationRepository();

        // storing brand
        await dynamoClient
          .put({
            TableName: process.env.TABLE_NAME,
            Item: {
              ...locationEntity,
              pk: `${DBIndexPrefixes.BRAND}${locationEntity.brandId}`,
              sk: `${DBIndexPrefixes.BRAND}${locationEntity.brandId}`,
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

        // When
        const result = await locationRepository.find(
          locationEntity.brandId, 
          locationEntity.id
        );
        
        // Then
        expect(result.id).toStrictEqual(locationEntity.id);
        expect(result.address).toStrictEqual(locationEntity.address);
        expect(result.hasOffer).toStrictEqual(locationEntity.hasOffer);
      });
    });
  });
});
