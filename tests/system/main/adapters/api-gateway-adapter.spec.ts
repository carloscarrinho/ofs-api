import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { apiGatewayAdapter } from "../../../../src/main/adapters/api-gateway-adapter";
import {
  addBrandControllerFactory,
  addOfferControllerFactory,
  getBrandControllerFactory,
} from "../../../../src/main/factories";
import { DBIndexPrefixes } from "../../../../src/infrastructure/db/enums/db-index-prefixes";
import { generateOfferModel } from "../../../fixtures/offer/offer-fixture";

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

      describe('Brand', () => {
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
                sk: `${DBIndexPrefixes.BRAND}${defaultBrandData.id}`,
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

      describe('Offer', () => {
        it("Should return 200 and brand data if add-data returns OK", async () => {
          // GIVEN
          const offerModel = generateOfferModel({ brandId: defaultBrandData.id });
          const event = makeEvent({
            body: JSON.stringify(offerModel),
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
                sk: `${DBIndexPrefixes.BRAND}${defaultBrandData.id}`,
              },
            })
            .promise();
  
          // WHEN
          const response = await apiGatewayAdapter(
            event,
            addOfferControllerFactory()
          );

          // THEN
          expect(response.statusCode).toEqual(200);
          expect(response.body.offer.name).toEqual(offerModel.name);
        });
      });
    });
  });
});
