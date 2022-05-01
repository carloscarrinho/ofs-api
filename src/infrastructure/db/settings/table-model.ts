export const tableModel = {
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
}