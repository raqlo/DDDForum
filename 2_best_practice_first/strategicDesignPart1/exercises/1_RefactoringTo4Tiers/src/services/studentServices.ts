import {Database} from "../database";

export class StudentsService {
    constructor(private db: Database) {
    }

    async createStudent(name: string) {
        return await this.db.students.save(name);
    };

    async getStudentList() {
        return await this.db.students.getAll()
    };

    async getStudentById(id: string) {
        return await this.db.students.getById(id)
    }

    async getStudentGrades(id: string) {
        return await this.db.students.getGrades(id)
    }
}