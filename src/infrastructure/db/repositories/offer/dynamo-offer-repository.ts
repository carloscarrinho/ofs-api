import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";
import { IOffer, IOfferModel } from "../../../../domain/entities/ioffer";
import { IOfferRepository } from "./ioffer-repository";
import { DBIndexPrefixes } from "../../enums/db-index-prefixes";
import { IDynamoSettings } from "../../settings/idynamo-settings";
import { OfferStatuses } from "../../../../domain/enums/offer-statuses";
import { ILinkLocationModel } from "../../../../application/use-cases/offer/ilink-location";

export class DynamoOfferRepository implements IOfferRepository {
  private readonly client: DynamoDB;

  constructor(private readonly settings: IDynamoSettings) {
    this.client = new DynamoDB({ endpoint: this.settings.tableEndpoint });
  }

  async store(offerModel: IOfferModel): Promise<IOffer> {
    const offer = {
      id: uuid(),
      locationsTotal: 0,
      status: OfferStatuses.CREATED,
      createdAt: new Date().toISOString(),
      ...offerModel,
    };

    await this.client.putItem({
      TableName: this.settings.tableName,
      ConditionExpression: "attribute_not_exists(pk)",
      Item: {
        pk: { S: `${DBIndexPrefixes.BRAND}${offer.brandId}` },
        sk: { S: `${DBIndexPrefixes.OFFER}${offer.id}` },
        id: { B: offer.id },
        brandId: { B: offer.brandId },
        name: { S: offer.name },
        startDate: { S: offer.startDate },
        endDate: { S: offer.endDate },
        locationsTotal: { N: offer.locationsTotal.toString() },
        createdAt: { S: offer.createdAt },
      },
    }).promise();

    return offer;
  }

  async find(brandId: string, offerId: string): Promise<IOffer> {
    const record = await this.client.getItem({
      TableName: this.settings.tableName,
      Key: {
        pk: { S: `${DBIndexPrefixes.BRAND}${brandId}`},
        sk: { S: `${DBIndexPrefixes.OFFER}${offerId}`}
      }
    }).promise();

    if(!record.Item) return null;
    
    return {
      id: record.Item.id.S,
      brandId: record.Item.brandId.S,
      name: record.Item.name.S,
      locationsTotal: parseInt(record.Item.locationsTotal.N),
      startDate: record.Item.startDate.S,
      endDate: record.Item.endDate.S,
      createdAt: record.Item.createdAt.S,
    }
  }

  async linkLocation(linkLocationModel: ILinkLocationModel): Promise<boolean> {
    await this.client
      .transactWriteItems({ TransactItems: [{
        Update: {
          TableName: this.settings.tableName,
          Key: {
            pk: { S: `${DBIndexPrefixes.BRAND}${linkLocationModel.brandId}` },
            sk: { S: `${DBIndexPrefixes.OFFER}${linkLocationModel.offerId}` },
          },
          ConditionExpression: "attribute_exists(pk)",
          UpdateExpression: "SET #locationsTotal = #locationsTotal + :inc",
          ExpressionAttributeNames: { "#locationsTotal": "locationsTotal" },
          ExpressionAttributeValues: { ":inc": { N: "1" } },
        },
      }] })
      .promise();

    return true;
  }
}