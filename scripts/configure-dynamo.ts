import { DynamoDB } from "aws-sdk";

async function createDynamoDbTable(): Promise<void> {
  console.log("Creating table...");

  const dynamoDb = new DynamoDB({ endpoint: process.env.TABLE_ENDPOINT });
  const tables = await dynamoDb.listTables().promise();
  const tableExists = tables.TableNames?.some((name: string) =>
    [process.env.TABLE_NAME].includes(name)
  );

  if (tableExists) {
    console.log("Table already exists, exiting...", JSON.stringify(tables));
    return;
  }

  const offersTable = await dynamoDb.createTable({
    AttributeDefinitions: [
      { AttributeName: "pk", AttributeType: "S" },
      { AttributeName: "sk", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "pk", KeyType: "HASH" },
      { AttributeName: "sk", KeyType: "RANGE" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "gsi1",
        KeySchema: [ 
          { AttributeName: "sk", KeyType: "HASH" }, 
          { AttributeName: "pk", KeyType: "RANGE" } 
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
        Projection: { ProjectionType: "ALL" },
      },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
    TableName: process.env.TABLE_NAME,
  }).promise();
  console.log("Table created successfully", JSON.stringify({ offersTable }));
}

void (async (): Promise<void> => {
  await createDynamoDbTable();
})();
