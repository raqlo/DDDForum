import {isMissingKeys} from "../../shared/utils/utils";

export class CreateStudentDTO {
  constructor(public name: string, public email: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["name", "email"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new Error(`Missing required fields: ${requiredKeys.join(", ")}`);
    }

    const { name, email } = body as {
      name: string;
      email: string;
    };

    return new CreateStudentDTO(name, email);
  }
}
