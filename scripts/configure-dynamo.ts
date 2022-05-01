import { DynamoDB } from "aws-sdk";
import { tableModel } from "../src/infrastructure/db/settings/table-model";

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

  const offersTable = await dynamoDb.createTable(tableModel).promise();
  console.log("Table created successfully", JSON.stringify({ offersTable }));
}

void (async (): Promise<void> => {
  await createDynamoDbTable();
})();
