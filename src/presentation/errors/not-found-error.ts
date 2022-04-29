export class NotFound extends Error {
  constructor(resource: string) {
    super(`Not Found Error`);
    this.name = "NotFound"
    this.message = `Resource ${resource} not found`
  }
}