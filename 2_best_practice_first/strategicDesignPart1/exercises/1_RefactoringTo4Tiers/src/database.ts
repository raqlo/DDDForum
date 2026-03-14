import {PrismaClient} from '@prisma/client';
import {buildStudentPersistence} from "./persistance/studentPersistance";

const prisma = new PrismaClient();

export {prisma}

interface StudentPersistence {
    save(name: string): any;
    getAll(): any;
    getById(id: string): any;
    getGrades(id: string): any;
}

export class Database {
    public students: StudentPersistence;

    constructor(private prisma: PrismaClient) {
        this.students = buildStudentPersistence(this.prisma);
    }
}