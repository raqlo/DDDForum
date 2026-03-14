import {prisma} from "../database";

export class StudentsService {
    constructor() {
    }

    async createStudent(name: string) {
        return prisma.student.create({data: {name}});
    };

    async getStudentList() {
        return prisma.student.findMany({
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    };

    async getStudentById(id: string) {
        return prisma.student.findUnique({
            where: {
                id
            },
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            }
        });
    }

    async getStudentGrades(id: string) {
        return prisma.studentAssignment.findMany({
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
        });
    }
}