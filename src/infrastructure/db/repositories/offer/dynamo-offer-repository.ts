import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";
import { IOffer, IOfferModel } from "../../../../domain/entities/ioffer";
import { IOfferRepository } from "./ioffer-repository";
import { DBIndexPrefixes } from "../../enums/db-index-prefixes";
import { IDynamoSettings } from "../../settings/idynamo-settings";
import { OfferStatuses } from "../../../../domain/enums/offer-statuses";

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
        status: { S: offer.status },
        type: { S: offer.type.toString() },
        createdAt: { S: offer.createdAt },
      },
    }).promise();

    return offer;
  }
}
