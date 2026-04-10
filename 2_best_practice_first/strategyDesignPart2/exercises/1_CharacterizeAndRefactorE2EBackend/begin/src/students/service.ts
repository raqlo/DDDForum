import {Database} from "../database";

export class StudentService {
    constructor(private db: Database) {
    }

    async createStudent(name: string, email: string) {
        return this.db.students.save(name, email);
    }

    async getAllStudents() {
        return this.db.students.getAll();
    }

    async getStudentById(id: string) {
        return this.db.students.getById(id);
    }

    async getListOfAssignmentsByStudent(id: string) {
        return this.db.students.getAssignments(id);
    }

    async getListOfStudentGrades(id: string) {
        return this.db.students.getGrades(id);
    }
}
