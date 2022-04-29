import { DynamoDB } from "aws-sdk";

async function createDynamoDbTable(): Promise<void> {
  console.log("Creating table...");

  const dynamoDb = new DynamoDB({ endpoint: process.env.TABLE_ENDPOINT });
  const tableName = process.env.TABLE_NAME as string;
  const tables = await dynamoDb.listTables().promise();
  const tableExists = tables.TableNames?.some((name: string) =>
    [tableName].includes(name)
  );

  if (tableExists) {
    console.log("Table already exists, exiting...", JSON.stringify(tables));
    return;
  }

  const offersTable = await dynamoDb
    .createTable({
      AttributeDefinitions: [{ AttributeName: "pk", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "pk", KeyType: "HASH" }],
      ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
      TableName: tableName,
    })
    .promise();

  console.log("Table created successfully", JSON.stringify({ offersTable }));
}

void (async (): Promise<void> => {
  await createDynamoDbTable();
})();
