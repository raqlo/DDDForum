import {PrismaClient} from '@prisma/client';

export interface StudentPersistence {
    save(name: string, email: string): any;
    getAll(): any;
    getById(id: string): any;
    getAssignments(id: string): any;
    getGrades(id: string): any;
}

export class StudentRepository implements StudentPersistence {
    constructor(private prisma: PrismaClient) {
    }

    async save(name: string, email: string) {
        return this.prisma.student.create({
            data: {
                name,
                email,
            },
        });
    }

    async getAll() {
        return this.prisma.student.findMany({
            include: {
                classes: true,
                assignments: true,
                reportCards: true,
            },
            orderBy: {
                name: "asc",
            },
        });
    }

    getById(id: string) {
        return this.prisma.student.findUnique({
            where: {
                id,
            },
            include: {
                classes: true,
                assignments: true,
                reportCards: true,
            },
        });
    }

    async getAssignments(id: string) {
        return this.prisma.studentAssignment.findMany({
            where: {
                studentId: id
            },
            include: {
                assignment: true,
            },
        });
    }

    async getGrades(id: string) {
        return this.prisma.gradedAssignment.findMany({
            where: {
                assignmentSubmission: {
                    studentAssignment: {
                        studentId: id
                    }
                }
            },
            include: {
                assignmentSubmission: {
                    include: {
                        studentAssignment: true
                    }
                },
            },
        });
    }
}