import {prisma} from "../database";

export class ClassService {
    async findClassByName(name: string) {
        return prisma.class.findUnique({where: {name}});
    }

    async createClass(name: string) {
        return prisma.class.create({
            data: {
                name,
            },
        });
    }

    async getClassEnrollment(studentId: string, classId: string) {
        return prisma.classEnrollment.findFirst({
            where: {
                studentId,
                classId,
            },
        });
    }

    async createEnrollment(studentId: string, classId: string) {
        return prisma.classEnrollment.create({
            data: {
                studentId,
                classId,
            },
        });
    }

    async findClassById(id: string) {
        return prisma.class.findUnique({
            where: {
                id,
            },
        });
    }

    async getAssignments(id: string) {
        return prisma.assignment.findMany({
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
