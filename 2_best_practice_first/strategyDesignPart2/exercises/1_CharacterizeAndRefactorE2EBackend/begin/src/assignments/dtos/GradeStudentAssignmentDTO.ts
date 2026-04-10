import {isMissingKeys} from "../../shared/utils/utils";

const VALID_GRADES = ["A", "A+", "B", "C", "D", "F"] as const;
export type Grade = typeof VALID_GRADES[number];

export class GradeStudentAssignmentDTO {
  constructor(
    public studentId: string,
    public assignmentId: string,
    public grade: Grade
  ) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["studentId", "assignmentId", "grade"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new Error(`Missing required fields: ${requiredKeys.join(", ")}`);
    }

    const { studentId, assignmentId, grade } = body as {
      studentId: string;
      assignmentId: string;
      grade: string;
    };

    // Validate grade is one of the allowed values
    if (!VALID_GRADES.includes(grade as Grade)) {
      throw new Error(
        `Invalid grade. Must be one of: ${VALID_GRADES.join(", ")}`
      );
    }

    return new GradeStudentAssignmentDTO(studentId, assignmentId, grade as Grade);
  }
}
