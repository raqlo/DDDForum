export type Assignment = { id: string, classId: string, title: string };
export type AssignmentSubmission = { id: string, studentAssignmentId: string };
export type Classroom = { id: string, name: string };
export type ClassEnrollment = { studentId: string, classId: string };
export type GradedAssignment = { id: string, assignmentSubmissionId: string, grade: string | null };
export type StudentAssignment = { id: string, studentId: string, assignmentId: string };
export type Student = { id: string, name: string, email: string };