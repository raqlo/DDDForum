import {isMissingKeys} from "../../shared/utils/utils";

export class CreateAssignmentDTO {
  constructor(public classId: string, public title: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["classId", "title"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new Error(`Missing required fields: ${requiredKeys.join(", ")}`);
    }

    const { classId, title } = body as {
      classId: string;
      title: string;
    };

    return new CreateAssignmentDTO(classId, title);
  }
}
