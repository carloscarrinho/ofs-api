export interface IDynamoSettings {
  tableEndpoint: string;
  tableName: string;
  httpOptions?: {
    connectTimeout: number,
    timeout: number,
  }
}