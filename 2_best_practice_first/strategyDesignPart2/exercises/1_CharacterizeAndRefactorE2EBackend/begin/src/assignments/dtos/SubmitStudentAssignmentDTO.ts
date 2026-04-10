import {isMissingKeys} from "../../shared/utils/utils";

export class SubmitStudentAssignmentDTO {
  constructor(public studentId: string, public assignmentId: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["studentId", "assignmentId"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new Error(`Missing required fields: ${requiredKeys.join(", ")}`);
    }

    const { studentId, assignmentId } = body as {
      studentId: string;
      assignmentId: string;
    };

    return new SubmitStudentAssignmentDTO(studentId, assignmentId);
  }
}
