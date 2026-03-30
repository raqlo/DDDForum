import {isMissingKeys} from "../../shared/utils/utils";

export class CreateClassEnrollmentDTO {
  constructor(public studentId: string, public classId: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["studentId", "classId"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new Error(`Missing required fields: ${requiredKeys.join(", ")}`);
    }

    const { studentId, classId } = body as {
      studentId: string;
      classId: string;
    };

    return new CreateClassEnrollmentDTO(studentId, classId);
  }
}
