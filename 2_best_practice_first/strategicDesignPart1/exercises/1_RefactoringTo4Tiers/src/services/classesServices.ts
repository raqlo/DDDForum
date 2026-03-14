import {prisma} from "../database";

export class ClassesServices {
    constructor() {
    }

    async createClass(name: string) {
        return prisma.class.create({
            data: {
                name
            }
        });
    }

    async createClassEnrollment(studentId: string, classId: string) {
        return prisma.classEnrollment.create({
            data: {
                studentId,
                classId
            }
        });
    }

    async findDuplicateClassEnrollment(studentId: string, classId: string) {
        return prisma.classEnrollment.findFirst({
            where: {
                studentId,
                classId
            }
        });
    }

    async getClassById(id: string) {
        return prisma.class.findUnique({
            where: {
                id
            }
        });
    }
}