import {PrismaClient} from '@prisma/client';

export interface ClassPersistence {
    save(name: string): any;
    getById(id: string): any;
    getByName(name: string): any;
    getEnrollment(studentId: string, classId: string): any;
    createEnrollment(studentId: string, classId: string): any;
    getAssignments(id: string): any;
}

export class ClassRepository implements ClassPersistence {
    constructor(private prisma: PrismaClient) {
    }

    async save(name: string) {
        return this.prisma.class.create({
            data: {
                name,
            },
        });
    }

    async getById(id: string) {
        return this.prisma.class.findUnique({
            where: {
                id,
            },
        });
    }

    async getByName(name: string) {
        return this.prisma.class.findUnique({
            where: {name}
        });
    }

    async getEnrollment(studentId: string, classId: string) {
        return this.prisma.classEnrollment.findFirst({
            where: {
                studentId,
                classId,
            },
        });
    }

    async createEnrollment(studentId: string, classId: string) {
        return this.prisma.classEnrollment.create({
            data: {
                studentId,
                classId,
            },
        });
    }

    async getAssignments(id: string) {
        return this.prisma.assignment.findMany({
            where: {
                classId: id,
            },
            include: {
                class: true,
                studentAssignments: true,
            },
        });
    }
}