import type {PrismaClient} from "@prisma/client";

export function buildStudentPersistence(prisma: PrismaClient) {
    return {
        save: async (name: string) =>
            prisma.student.create({data: {name}}),

        getAll: async () =>
            await prisma.student.findMany({
                include: {
                    classes: true,
                    assignments: true,
                    reportCards: true,
                },
                orderBy: {
                    name: "asc",
                },
            }),
        getById: async (id: string) => prisma.student.findUnique({
            where: {
                id
            },
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            }
        }),
        getGrades: async (id: string) => prisma.studentAssignment.findMany({
            where: {
                studentId: id,
                status: 'submitted',
                grade: {
                    not: null
                }
            },
            include: {
                assignment: true
            },
        })
    };
}