import { v4 as uuid } from "uuid";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IBrandModel } from "../../../../application/use-cases/brand/iadd-brand";
import { IBrand } from "../../../../domain/entities/ibrand";
import { IBrandRepository } from "./ibrand-repository";

interface DynamoSettings {
  tableEndpoint: string;
  tableName: string;
}

export class DynamoBrandRepository implements IBrandRepository {
  private readonly client: DocumentClient;

  constructor(private readonly settings: DynamoSettings) {
    this.client = new DocumentClient({ endpoint: this.settings.tableEndpoint });
  }

  async store(brandData: IBrandModel): Promise<IBrand> {
    const newBrandData = { id: uuid(), ...brandData };

    await this.client
      .put({
        TableName: this.settings.tableName,
        Item: {
          ...newBrandData,
          pk: `brand#${newBrandData.id}`,
          createdAt: new Date().toISOString(),
        },
      })
      .promise();

    return newBrandData;
  }

  async find(id: string): Promise<IBrand> {
    const record = await this.client
      .get({
        TableName: process.env.TABLE_NAME,
        Key: { pk: `brand#${id}` },
      })
      .promise();

    return {
      id: record.Item.id,
      name: record.Item.name,
      createdAt: record.Item.createdAt,
    }
  }
}
