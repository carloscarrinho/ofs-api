import { v4 as uuid } from "uuid";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ILocation, ILocationModel } from "../../../../domain/entities/ilocation";
import { ILocationRepository } from "./ilocation-repository";
import { DBIndexPrefixes } from "../../enums/db-index-prefixes";
import { IDynamoSettings } from "../../settings/idynamo-settings";

export class DynamoLocationRepository implements ILocationRepository {
  private readonly client: DocumentClient;

  constructor(private readonly settings: IDynamoSettings) {
    this.client = new DocumentClient({
      endpoint: this.settings.tableEndpoint,
    });
  }

  async store(locationModel: ILocationModel): Promise<ILocation> {
    const location = {
      id: uuid(),
      hasOffer: false,
      createdAt: new Date().toISOString(),
      ...locationModel,
    };

    const params = {
      TableName: this.settings.tableName,
      Item: {
        pk: `${DBIndexPrefixes.BRAND}${location.brandId}`,
        sk: `${DBIndexPrefixes.LOCATION}${location.id}`,
        id: location.id,
        brandId: location.brandId,
        address: location.address,
        hasOffer: location.hasOffer,
        createdAt: location.createdAt,
      },
    };

    await this.client.put(params).promise();
    return location;
  }
}
