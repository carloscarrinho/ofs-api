import { v4 as uuid } from "uuid";
import { DynamoDB, Location } from "aws-sdk";
import { ILocation, ILocationModel } from "../../../../domain/entities/ilocation";
import { ILocationRepository } from "./ilocation-repository";
import { DBIndexPrefixes } from "../../enums/db-index-prefixes";
import { IDynamoSettings } from "../../settings/idynamo-settings";

export class DynamoLocationRepository implements ILocationRepository {
  private readonly client: DynamoDB;

  constructor(private readonly settings: IDynamoSettings) {
    this.client = new DynamoDB({ endpoint: this.settings.tableEndpoint });
  }

  async store(locationModel: ILocationModel): Promise<ILocation> {
    const location = {
      id: uuid(),
      hasOffer: false,
      createdAt: new Date().toISOString(),
      ...locationModel,
    };
    
    await this.client.putItem({
      TableName: this.settings.tableName,
      ConditionExpression: "attribute_not_exists(pk)",
      Item: {
        pk: { S: `${DBIndexPrefixes.BRAND}${location.brandId}` },
        sk: { S: `${DBIndexPrefixes.LOCATION}${location.id}` },
        id: { B: location.id },
        brandId: { S: location.brandId },
        address: { S: location.address },
        hasOffer: { BOOL: location.hasOffer },
        createdAt: { S: location.createdAt },
      },
    }).promise();

    return location;
  }

  async find(brandId: string, locationId: string): Promise<ILocation> {
    const record = await this.client.getItem({
      TableName: this.settings.tableName,
      Key: {
        pk: { S: `${DBIndexPrefixes.BRAND}${brandId}`},
        sk: { S: `${DBIndexPrefixes.LOCATION}${locationId}`}
      }
    }).promise();

    if(!record.Item) return null;
    
    return {
      id: record.Item.id.S,
      brandId: record.Item.brandId.S,
      address: record.Item.address.S,
      hasOffer: record.Item.hasOffer.BOOL,
      createdAt: record.Item.createdAt.S,
    }
  }
}
