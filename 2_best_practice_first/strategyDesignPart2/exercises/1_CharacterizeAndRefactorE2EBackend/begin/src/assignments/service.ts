import {prisma} from "../database";

export class AssignmentService {
    async createAssignment(classId: string, title: string) {
        return prisma.assignment.create({
            data: {
                classId,
                title,
            },
        });
    }

    async getAssignmentById(assignmentId: string, includeRelations = false) {
        return prisma.assignment.findUnique({
            where: {id: assignmentId},
            ...(includeRelations && {
                include: {
                    class: true,
                    studentAssignments: true,
                }
            })
        });
    }

    async getStudentAssignment(studentId: string, assignmentId: string) {
        return prisma.studentAssignment.findUnique({
            where: {
                studentId_assignmentId: {
                    studentId,
                    assignmentId
                }
            }
        });
    }

    async createStudentAssignment(studentId: string, assignmentId: string) {
        return prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            },
        });
    }

    async getAssignmentSubmission(studentAssignmentId: string) {
        return prisma.assignmentSubmission.findFirst({
            where: {
                studentAssignmentId
            }
        });
    }

    async createAssignmentSubmission(studentAssignmentId: string) {
        return prisma.assignmentSubmission.create({
            data: {
                studentAssignmentId
            },
        });
    }

    async getGradedAssignment(assignmentId: string) {
        return prisma.gradedAssignment.findFirst({
            where: {
                assignmentSubmission: {
                    studentAssignment: {
                        assignmentId: assignmentId
                    }
                }
            }
        });
    }

    async createGradedAssignment(assignmentSubmissionId: string, grade: string) {
        return prisma.gradedAssignment.create({
            data: {
                grade,
                assignmentSubmissionId
            }
        });
    }
}