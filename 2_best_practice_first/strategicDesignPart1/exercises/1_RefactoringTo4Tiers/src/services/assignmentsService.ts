import {Database, prisma} from "../database";

export class AssignmentsService {
    constructor(private db: Database) {
    }

    async createAssignment(classId: string, title: string) {
        return this.db.assignments.save(classId, title);
    }

    async getAssignmentById(id: string) {
        return this.db.assignments.getById(id);
    }

    async getAssignmentWithClass(id: string) {
        return this.db.assignments.getWithClass(id);
    }

    async getListOfStudentAssignments(studentId: string) {
        return this.db.assignments.getListOfStudentAssignments(studentId);
    }

    async createStudentAssignment(studentId: string, assignmentId: string) {
        return this.db.assignments.saveStudentAssignment(studentId, assignmentId);
    }

    async getStudentAssignmentById(id: string) {
        return this.db.assignments.getStudentAssignmentById(id)
    }

    async updateStudentAssignment(id: string) {
        return this.db.assignments.updateStudentAssignment(id);
    }

    async updateStudentAssignmentGrade(id: string, grade: string) {
        return this.db.assignments.updateStudentAssignmentGrade(id, grade);
    }
}