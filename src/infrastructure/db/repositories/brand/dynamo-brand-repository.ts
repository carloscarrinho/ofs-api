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

  async store(brandModel: IBrandModel): Promise<IBrand> {
    const brand = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      ...brandModel,
    };

    const params = {
      TableName: this.settings.tableName,
      Item: {
        pk: `${DBIndexPrefixes.BRAND}${brand.id}`,
        sk: `${DBIndexPrefixes.BRAND}${brand.id}`,
        id: brand.id,
        name: brand.name,
        createdAt: brand.createdAt,
      },
    };

    await this.client.put(params).promise();
    return brand;
  }

  async find(id: string): Promise<IBrand> {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        pk: `${DBIndexPrefixes.BRAND}${id}`,
        sk: `${DBIndexPrefixes.BRAND}${id}`,
      },
    };

    const record = await this.client.get(params).promise();
    if (!record.Item) return null;

    return {
      id: record.Item.id,
      name: record.Item.name,
      createdAt: record.Item.createdAt,
    };
  }
}
