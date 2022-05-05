import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { apiGatewayAdapter } from "../../../../src/main/adapters/api-gateway-adapter";
import {
  addBrandControllerFactory,
  addOfferControllerFactory,
  addLocationControllerFactory,
  getBrandControllerFactory,
  getLocationControllerFactory,
  linkLocationControllerFactory,
} from "../../../../src/main/factories";
import { DBIndexPrefixes } from "../../../../src/infrastructure/db/enums/db-index-prefixes";
import {
  generateOfferEntity,
  generateOfferModel,
} from "../../../fixtures/offer/offer-fixture";
import {
  generateLocationEntity,
  generateLocationModel,
} from "../../../fixtures/location/location-fixture";
import { generateBrandEntity } from "../../../fixtures/brand/brand-fixture";

const defaultBrandData = generateBrandEntity();

const makeEvent = (data?: Partial<APIGatewayEvent>) => {
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

      describe("Brand", () => {
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
            pathParameters: { brandId: defaultBrandData.id },
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

      describe("Offer", () => {
        it("Should return 200 and offer data if add-offer returns OK", async () => {
          // GIVEN
          const offerModel = generateOfferModel({
            brandId: defaultBrandData.id,
          });
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

        it("Should return 200 and body as TRUE if link-location returns OK", async () => {
          // GIVEN
          const offerEntity = generateOfferEntity({
            brandId: defaultBrandData.id,
          });

          const locationEntity = generateLocationEntity({
            brandId: defaultBrandData.id,
          });

          const event = makeEvent({
            pathParameters: { locationId: locationEntity.id },
            body: JSON.stringify({
              brandId: locationEntity.brandId,
              offerId: offerEntity.id,
            }),
          });

          const dynamoClient = new DocumentClient({
            endpoint: process.env.TABLE_ENDPOINT,
          });

          // storing the brand
          await dynamoClient
            .put({
              TableName: process.env.TABLE_NAME,
              Item: {
                ...defaultBrandData,
                pk: `${DBIndexPrefixes.BRAND}${offerEntity.brandId}`,
                sk: `${DBIndexPrefixes.BRAND}${offerEntity.brandId}`,
              },
            })
            .promise();
            
          // storing the location
          await dynamoClient
            .put({
              TableName: process.env.TABLE_NAME,
              Item: {
                ...locationEntity,
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

          // WHEN
          const response = await apiGatewayAdapter(
            event,
            linkLocationControllerFactory()
          );

          // THEN
          expect(response.statusCode).toEqual(200);
          expect(response.body.result).toBe(true);
        });
      });

      describe("Location", () => {
        it("Should return 200 and location data if add-location returns OK", async () => {
          // GIVEN
          const locationModel = generateLocationModel({
            brandId: defaultBrandData.id,
          });
          const event = makeEvent({
            body: JSON.stringify(locationModel),
          });

          // storing the location
          const dynamoClient = new DocumentClient({
            endpoint: process.env.TABLE_ENDPOINT,
          });
          await dynamoClient
            .put({
              TableName: process.env.TABLE_NAME,
              Item: {
                ...defaultBrandData,
                pk: `${DBIndexPrefixes.BRAND}${locationModel.brandId}`,
                sk: `${DBIndexPrefixes.BRAND}${locationModel.brandId}`,
              },
            })
            .promise();

          // WHEN
          const response = await apiGatewayAdapter(
            event,
            addLocationControllerFactory()
          );

          // THEN
          expect(response.statusCode).toEqual(200);
          expect(response.body.location.address).toEqual(locationModel.address);
        });

        it("Should return 200 and location data if get-location returns OK", async () => {
          // GIVEN
          const locationEntity = generateLocationEntity({
            brandId: defaultBrandData.id
          });
          
          const event = makeEvent({
            headers: { brandId: defaultBrandData.id },
            pathParameters: { locationId: locationEntity.id },
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

          // storing the location
          await dynamoClient
            .put({
              TableName: process.env.TABLE_NAME,
              Item: {
                ...locationEntity,
                pk: `${DBIndexPrefixes.BRAND}${locationEntity.brandId}`,
                sk: `${DBIndexPrefixes.LOCATION}${locationEntity.id}`,
              },
            })
            .promise();

          // WHEN
          const response = await apiGatewayAdapter(
            event,
            getLocationControllerFactory()
          );
          
          // THEN
          expect(response.statusCode).toEqual(200);
          expect(response.body.location).toEqual(locationEntity);
        });
      });
    });
  });
});
