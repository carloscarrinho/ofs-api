import { InvalidParamError } from "../errors/invalid-param-error";
import { IValidation } from "./ivalidation";

export class XApiKeyValidator implements IValidation {
  validate(value: string): Error {
    if(value !== "valid-api-key") return new InvalidParamError("x-api-key");
    return null;
  }
}
