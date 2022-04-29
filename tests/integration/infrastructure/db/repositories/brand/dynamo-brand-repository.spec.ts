import { DynamoDB } from "aws-sdk";
import { } from "aws-sdk/";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DynamoBrandRepository } from "../../../../../../src/infrastructure/db/repositories/brand/dynamo-brand-repository";
import { IBrandRepository } from "../../../../../../src/infrastructure/db/repositories/brand/ibrand-repository";

const dynamoDb = new DynamoDB({ endpoint: process.env.TABLE_ENDPOINT });

const prepareEnvironment = async () => {
  try {
    const tables = await dynamoDb.listTables().promise();
    const foundTable = tables.TableNames?.some((name: string) =>
      [process.env.TABLE_NAME].includes(name)
    );

    if (foundTable) return;

    await dynamoDb
      .createTable({
        TableName: process.env.TABLE_NAME,
        AttributeDefinitions: [{ AttributeName: "pk", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "pk", KeyType: "HASH" }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10,
        },
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

const makeDynamoBrandRepository = (): IBrandRepository => {
  const settings = {
    tableEndpoint: process.env.TABLE_ENDPOINT,
    tableName: process.env.TABLE_NAME,
  };

  return new DynamoBrandRepository(settings);
};

const defaultNewBrandData = { id: "some-id", name: "any_name" };

describe("Integration", () => {
  describe("Infastructure::DB::Repositories::Brand", () => {
    beforeEach(prepareEnvironment);
    afterEach(teardownEnvironment);

    describe("DynamoBrandRepository.store()", () => {
      it("Should throw an error if DynamoDB throws", async () => {
        // Given
        // forcing an error because the table does not exists.
        await dynamoDb
          .deleteTable({ TableName: process.env.TABLE_NAME })
          .promise();
        const brandRepository = makeDynamoBrandRepository();

        // When
        const result = brandRepository.store(defaultNewBrandData);

        // Then
        await expect(result).rejects.toThrow();
      });

      it("Should return the brand data if brand was stored successfully", async () => {
        // Given
        const dynamoClient = new DocumentClient({
          endpoint: process.env.TABLE_ENDPOINT,
        });
        const brandRepository = makeDynamoBrandRepository();

        // When
        const result = await brandRepository.store(defaultNewBrandData);
        const record = await dynamoClient
          .get({ 
            TableName: process.env.TABLE_NAME,
            Key: { pk: `brand#${defaultNewBrandData.id}` } 
          })
          .promise();

        // Then
        expect(record.Item.name).toEqual(defaultNewBrandData.name);
        expect(result).toStrictEqual(defaultNewBrandData);
      });
    });
    
    describe("DynamoBrandRepository.find()", () => {
      it("Should throw an error if DynamoDB throws", async () => {
        // Given
        // forcing an error because the table does not exists.
        await dynamoDb
          .deleteTable({ TableName: process.env.TABLE_NAME })
          .promise();
        const brandRepository = makeDynamoBrandRepository();

        // When
        const result = brandRepository.find(defaultNewBrandData.id);

        // Then
        await expect(result).rejects.toThrow();
      });
    });
  });
});
