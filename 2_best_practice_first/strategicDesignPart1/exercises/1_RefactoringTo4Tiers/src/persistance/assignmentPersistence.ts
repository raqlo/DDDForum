import {PrismaClient} from "@prisma/client";

export function buildAssignmentPersistence(prisma: PrismaClient) {
    return {
        save: async (classId: string, title: string) => prisma.assignment.create({
            data: {
                classId,
                title
            }
        }),
        getById: async (id: string) => prisma.assignment.findUnique({
            where: {
                id
            }
        }),
        getWithClass: async (id: string) => prisma.assignment.findUnique({
            include: {
                class: true,
                studentTasks: true
            },
            where: {
                id
            }
        }),
        getListOfStudentAssignments: async (id: string) => prisma.studentAssignment.findMany({
            where: {
                studentId: id,
                status: 'submitted'
            },
            include: {
                assignment: true
            },
        }),
        saveStudentAssignment: async (studentId: string, assignmentId: string) => prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            }
        }),
        getStudentAssignmentById: async (id: string) => prisma.studentAssignment.findUnique({
            where: {
                id
            }
        }),
        updateStudentAssignment: async (id: string) => prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                status: 'submitted'
            }
        }),
        updateStudentAssignmentGrade: async (id: string, grade: string) => prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                grade
            }
        })
    }
}