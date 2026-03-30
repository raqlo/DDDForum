import {PrismaClient} from '@prisma/client';

export interface AssignmentPersistence {
    save(classId: string, title: string): any;
    getById(assignmentId: string, includeRelations?: boolean): any;
    getStudentAssignment(studentId: string, assignmentId: string): any;
    createStudentAssignment(studentId: string, assignmentId: string): any;
    getAssignmentSubmission(studentAssignmentId: string): any;
    createAssignmentSubmission(studentAssignmentId: string): any;
    getGradedAssignment(assignmentId: string): any;
    createGradedAssignment(assignmentSubmissionId: string, grade: string): any;
}

export class AssignmentRepository implements AssignmentPersistence {
    constructor(private prisma: PrismaClient) {
    }

    async save(classId: string, title: string) {
        return this.prisma.assignment.create({
            data: {
                classId,
                title,
            },
        });
    }

    async getById(assignmentId: string, includeRelations = false) {
        return this.prisma.assignment.findUnique({
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
        return this.prisma.studentAssignment.findUnique({
            where: {
                studentId_assignmentId: {
                    studentId,
                    assignmentId
                }
            }
        });
    }

    async createStudentAssignment(studentId: string, assignmentId: string) {
        return this.prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            },
        });
    }

    async getAssignmentSubmission(studentAssignmentId: string) {
        return this.prisma.assignmentSubmission.findFirst({
            where: {
                studentAssignmentId
            }
        });
    }

    async createAssignmentSubmission(studentAssignmentId: string) {
        return this.prisma.assignmentSubmission.create({
            data: {
                studentAssignmentId
            },
        });
    }

    async getGradedAssignment(assignmentId: string) {
        return this.prisma.gradedAssignment.findFirst({
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
        return this.prisma.gradedAssignment.create({
            data: {
                grade,
                assignmentSubmissionId
            }
        });
    }
}