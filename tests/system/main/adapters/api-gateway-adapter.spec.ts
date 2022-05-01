import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { apiGatewayAdapter } from "../../../../src/main/adapters/api-gateway-adapter";
import {
  addBrandControllerFactory,
  getBrandControllerFactory,
} from "../../../../src/main/factories";
import { DBIndexPrefixes } from "../../../../src/infrastructure/db/enums/db-index-prefixes";

const defaultBrandData = {
  id: "some-id",
  name: "any-name",
  createdAt: "2022-04-29T20:41:54.630Z",
};

const makeEvent = (data?: object) => {
  return {
    headers: {},
    pathParameters: {},
    body: JSON.stringify({}),
    ...data,
  } as unknown as APIGatewayEvent;
};

const dynamoDb = new DynamoDB({ endpoint: process.env.TABLE_ENDPOINT });

const prepareDBEnvironment = async () => {
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

const teardownDBEnvironment = async () => {
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

describe("System", () => {
  describe("Main::Adapters", () => {
    describe("apiGatewayAdapter", () => {
      beforeEach(prepareDBEnvironment);
      afterEach(teardownDBEnvironment);

      it("Should return 200 and brand data if add-data returns OK", async () => {
        // GIVEN
        const event = makeEvent({
          body: JSON.stringify({ name: defaultBrandData.name }),
        });

        // WHEN
        const response = await apiGatewayAdapter(
          event,
          addBrandControllerFactory()
        );

        // THEN
        expect(response.statusCode).toEqual(200);
        expect(response.body.brand.name).toEqual(defaultBrandData.name);
      });

      it("Should return 200 and brand data if get-brand returns OK", async () => {
        // GIVEN
        const event = makeEvent({
          pathParameters: { brandId: "some-id" },
        });

        // storing the brand
        const dynamoClient = new DocumentClient({
          endpoint: process.env.TABLE_ENDPOINT,
        });
        await dynamoClient
          .put({
            TableName: process.env.TABLE_NAME,
            Item: {
              ...defaultBrandData,
              pk: `${DBIndexPrefixes.BRAND}${defaultBrandData.id}`,
            },
          })
          .promise();

        // WHEN
        const response = await apiGatewayAdapter(
          event,
          getBrandControllerFactory()
        );

        // THEN
        expect(response.statusCode).toEqual(200);
        expect(response.body.brand).toEqual(defaultBrandData);
      });
    });
  });
});
