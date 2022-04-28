import { ok } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { IController } from "../icontroller";

export class GetBrandController implements IController {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return ok({
      success: "ok",
    });
  }
}
