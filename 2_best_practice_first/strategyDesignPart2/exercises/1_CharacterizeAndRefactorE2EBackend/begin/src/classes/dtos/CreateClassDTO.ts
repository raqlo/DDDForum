import {isMissingKeys} from "../../shared/utils/utils";

export class CreateClassDTO {
  constructor(public name: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["name"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new Error(`Missing required fields: ${requiredKeys.join(", ")}`);
    }

    const { name } = body as {
      name: string;
    };

    return new CreateClassDTO(name);
  }
}
