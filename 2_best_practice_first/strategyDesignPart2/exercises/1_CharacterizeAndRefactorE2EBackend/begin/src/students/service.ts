import {prisma} from "../database";

export class StudentService {
    public async createStudent(name: string, email: string) {
        const student = await prisma.student.create({
            data: {
                name,
                email,
            },
        });
        return student;
    }


    async GetAllStudents() {
        const students = await prisma.student.findMany({
            include: {
                classes: true,
                assignments: true,
                reportCards: true,
            },
            orderBy: {
                name: "asc",
            },
        });
        return students;
    }

    async getStudentById(id: string) {
        const student = await prisma.student.findUnique({
            where: {
                id,
            },
            include: {
                classes: true,
                assignments: true,
                reportCards: true,
            },
        });
        return student;
    }

    async getListOfAssignmentsByStudent(id: string) {
        const studentAssignments = await prisma.studentAssignment.findMany({
            where: {
                studentId: id
            },
            include: {
                assignment: true,
            },
        });
        return studentAssignments;
    }

    async getListOfStudentGrades(id: string) {
        const listOfStudentGrades = await prisma.gradedAssignment.findMany({
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
        return listOfStudentGrades;
    }
}

