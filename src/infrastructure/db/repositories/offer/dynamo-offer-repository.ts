import { v4 as uuid } from "uuid";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IOffer, IOfferModel } from "../../../../domain/entities/ioffer";
import { IOfferRepository } from "./ioffer-repository";
import { DBIndexPrefixes } from "../../enums/db-index-prefixes";
import { IDynamoSettings } from "../../settings/idynamo-settings";
import { OfferStatuses } from "../../../../domain/enums/offer-statuses";

export class DynamoOfferRepository implements IOfferRepository {
  private readonly client: DocumentClient;

  constructor(private readonly settings: IDynamoSettings) {
    this.client = new DocumentClient({
      endpoint: this.settings.tableEndpoint,
    });
  }

  async store(offerModel: IOfferModel): Promise<IOffer> {
    const offer = {
      id: uuid(),
      locationsTotal: 0,
      status: OfferStatuses.CREATED,
      createdAt: new Date().toISOString(),
      ...offerModel,
    };

    const params = {
      TableName: this.settings.tableName,
      Item: {
        pk: `${DBIndexPrefixes.OFFER}${offer.id}`,
        sk: `${DBIndexPrefixes.BRAND}${offer.brandId}`,
        id: offer.id,
        brandId: offer.brandId,
        name: offer.name,
        startDate: offer.startDate,
        endDate: offer.endDate,
        locationsTotal: offer.locationsTotal,
        status: offer.status,
        type: offer.type,
        createdAt: offer.createdAt,
      },
    };

    await this.client.put(params).promise();
    return offer;
  }
}
