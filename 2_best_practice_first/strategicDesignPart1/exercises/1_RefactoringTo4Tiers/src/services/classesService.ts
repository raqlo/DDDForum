import {Database} from "../database";

export class ClassesService {
    constructor(private db: Database) {
    }

    async createClass(name: string) {
        return this.db.classes.save(name);
    }

    async createClassEnrollment(studentId: string, classId: string) {
        return this.db.classes.saveEnrollment(studentId, classId);
    }

    async findDuplicateClassEnrollment(studentId: string, classId: string) {
        return this.db.classes.getEnrollment(studentId, classId);
    }

    async getClassById(id: string) {
        return this.db.classes.getById(id);
    }
}