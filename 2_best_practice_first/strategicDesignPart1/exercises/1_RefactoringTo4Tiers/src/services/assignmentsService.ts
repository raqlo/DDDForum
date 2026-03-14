import {prisma} from "../database";

export class AssignmentsService {
    constructor() {
    }

    async createAssignment(classId: string, title: string) {
        return prisma.assignment.create({
            data: {
                classId,
                title
            }
        })
    }

    async getAssignmentById(id: string) {
        return prisma.assignment.findUnique({
            where: {
                id
            }
        })
    }

    async getAssignmentWithClass(id: string) {
        return prisma.assignment.findUnique({
            include: {
                class: true,
                studentTasks: true
            },
            where: {
                id
            }
        });
    }

    async getListOfStudentAssignments(studentId: string) {
        return prisma.studentAssignment.findMany({
            where: {
                studentId: id,
                status: 'submitted'
            },
            include: {
                assignment: true
            },
        });
    }

    async createStudentAssignment(studentId: string, assignmentId: string) {
        return prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            }
        });
    }

    async getStudentAssignmentById(id: string) {
        return prisma.studentAssignment.findUnique({
            where: {
                id
            }
        });
    }

    async updateStudentAssignment(id: string) {
        return prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                status: 'submitted'
            }
        });
    }

    async updateStudentAssignmentGrade(id: string, grade: string) {
        return prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                grade
            }
        });
    }



}