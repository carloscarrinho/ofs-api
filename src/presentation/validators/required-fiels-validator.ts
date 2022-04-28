import { MissingParamError } from "../errors/missing-param-error";
import { IValidation } from "./ivalidation";

export class RequiredFieldsValidator implements IValidation {
  constructor(private fields: string[]) {}
  
  validate(input: any): Error {
    for(let field of this.fields) {
      if(!input[field]) return new MissingParamError(field);
    }

    return null;
  }
}
