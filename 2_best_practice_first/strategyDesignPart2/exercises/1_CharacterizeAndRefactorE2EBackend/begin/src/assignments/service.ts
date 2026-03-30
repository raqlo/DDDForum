import {Database} from "../database";

export class AssignmentService {
    constructor(private db: Database) {
    }

    async createAssignment(classId: string, title: string) {
        return this.db.assignments.save(classId, title);
    }

    async getAssignmentById(assignmentId: string, includeRelations = false) {
        return this.db.assignments.getById(assignmentId, includeRelations);
    }

    async getStudentAssignment(studentId: string, assignmentId: string) {
        return this.db.assignments.getStudentAssignment(studentId, assignmentId);
    }

    async createStudentAssignment(studentId: string, assignmentId: string) {
        return this.db.assignments.createStudentAssignment(studentId, assignmentId);
    }

    async getAssignmentSubmission(studentAssignmentId: string) {
        return this.db.assignments.getAssignmentSubmission(studentAssignmentId);
    }

    async createAssignmentSubmission(studentAssignmentId: string) {
        return this.db.assignments.createAssignmentSubmission(studentAssignmentId);
    }

    async getGradedAssignment(assignmentId: string) {
        return this.db.assignments.getGradedAssignment(assignmentId);
    }

    async createGradedAssignment(assignmentSubmissionId: string, grade: string) {
        return this.db.assignments.createGradedAssignment(assignmentSubmissionId, grade);
    }
}