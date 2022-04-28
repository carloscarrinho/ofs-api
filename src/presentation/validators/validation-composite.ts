import { IValidation } from "./ivalidation";

export class ValidationComposite implements IValidation {
  constructor(private validators: IValidation[]){}
  
  validate (input: any): Error {
    for(let validator of this.validators) {
      const error = validator.validate(input);

      if (error) return error;
    }

    return null;
  };
}