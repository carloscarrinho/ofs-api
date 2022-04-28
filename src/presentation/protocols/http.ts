export interface HttpRequest {
  header: any,
  params?: any,
  body?: any,
}

export interface HttpResponse {
  statusCode: number,
  body?: any,
}