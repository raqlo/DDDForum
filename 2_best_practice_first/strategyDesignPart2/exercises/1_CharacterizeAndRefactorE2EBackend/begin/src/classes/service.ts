import {Database} from "../database";

export class ClassService {
    constructor(private db: Database) {
    }

    async findClassByName(name: string) {
        return this.db.classes.getByName(name);
    }

    async createClass(name: string) {
        return this.db.classes.save(name);
    }

    async getClassEnrollment(studentId: string, classId: string) {
        return this.db.classes.getEnrollment(studentId, classId);
    }

    async createEnrollment(studentId: string, classId: string) {
        return this.db.classes.createEnrollment(studentId, classId);
    }

    async findClassById(id: string) {
        return this.db.classes.getById(id);
    }

    async getAssignments(id: string) {
        return this.db.classes.getAssignments(id);
    }
}