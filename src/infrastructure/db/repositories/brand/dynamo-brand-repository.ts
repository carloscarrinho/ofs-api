import { v4 as uuid } from "uuid";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IBrand, IBrandModel } from "../../../../domain/entities/ibrand";
import { IBrandRepository } from "./ibrand-repository";
import { DBIndexPrefixes } from "../../enums/db-index-prefixes";
import { IDynamoSettings } from "../../settings/idynamo-settings";

export class DynamoBrandRepository implements IBrandRepository {
  private readonly client: DocumentClient;

  constructor(private readonly settings: IDynamoSettings) {
    this.client = new DocumentClient({
      endpoint: this.settings.tableEndpoint,
    });
  }

  async store(brandData: IBrandModel): Promise<IBrand> {
    const newBrandData = { 
      id: uuid(), 
      ...brandData,
      createdAt: new Date().toISOString()
    };

    await this.client
      .put({
        TableName: this.settings.tableName,
        Item: {
          ...newBrandData,
          pk: `${DBIndexPrefixes.BRAND}${newBrandData.id}`,
        },
      })
      .promise();

    return newBrandData;
  }

  async find(id: string): Promise<IBrand> {
    const record = await this.client
      .get({
        TableName: process.env.TABLE_NAME,
        Key: { pk: `${DBIndexPrefixes.BRAND}${id}` },
      })
      .promise();

    if(!record.Item) return null;

    return {
      id: record.Item.id,
      name: record.Item.name,
      createdAt: record.Item.createdAt,
    }
  }
}
