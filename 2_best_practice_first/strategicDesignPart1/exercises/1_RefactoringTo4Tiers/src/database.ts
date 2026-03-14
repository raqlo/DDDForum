import {PrismaClient} from '@prisma/client';
import {buildStudentPersistence} from "./persistance/studentPersistance";
import {buildClassPersistence} from "./persistance/classPersistence";

const prisma = new PrismaClient();

export {prisma}

interface StudentPersistence {
    save(name: string): any;
    getAll(): any;
    getById(id: string): any;
    getGrades(id: string): any;
}

interface ClassPersistence {
    save(name: string): any;
    saveEnrollment(studentId: string, classId: string): any;
    getEnrollment(studentId: string, classId: string): any;
    getById(id: string): any;
}

export class Database {
    public students: StudentPersistence;
    public classes: ClassPersistence

    constructor(private prisma: PrismaClient) {
        this.students = buildStudentPersistence(this.prisma);
        this.classes = buildClassPersistence(this.prisma);
    }
}

