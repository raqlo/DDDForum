import {PrismaClient} from "@prisma/client";

export function buildClassPersistence(prisma: PrismaClient) {
    return {
        save: async (name: string) => prisma.class.create({data: {name}}),
        getById: async (id: string) => prisma.class.findUnique({where: {id}}),
        saveEnrollment: async (studentId: string, classId: string) => prisma.classEnrollment.create({
            data: {
                studentId,
                classId
            }
        }),
        getEnrollment: async (studentId: string, classId: string) => prisma.classEnrollment.findUnique({
            where: {
                studentId_classId: {
                    studentId,
                    classId
                }
            }
        })
    }
}