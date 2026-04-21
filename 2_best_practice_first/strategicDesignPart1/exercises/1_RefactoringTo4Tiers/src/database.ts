import {PrismaClient} from '@prisma/client';
import {buildStudentPersistence} from "./persistance/studentPersistance";
import {buildClassPersistence} from "./persistance/classPersistence";
import {buildAssignmentPersistence} from "./persistance/assignmentPersistence";


interface StudentPersistence {
    save(name: string): any;
    getAll(): any;
    getById(id: string): any;
    getGrades(id: string): any;
}

interface ClassPersistence {
    save(name: string): any;
    saveEnrollment(studentId: string, classId: string): any;
    getEnrollment(studentId: string, classId: string): any;
    getById(id: string): any;
}

interface AssignmentPersistence {
    save(classId: string, title: string): any;
    getById(id: string): any;
    getWithClass(id: string): any;
    getListOfStudentAssignments(studentId: string): any;
    saveStudentAssignment(studentId: string, assignmentId: string): any;
    getStudentAssignmentById(id: string): any;
    updateStudentAssignment(id: string): any;
    updateStudentAssignmentGrade(id: string, grade: string): any;
}

export class Database {
    public students: StudentPersistence;
    public classes: ClassPersistence;
    public assignments: AssignmentPersistence;

    constructor(private prisma: PrismaClient) {
        this.students = buildStudentPersistence(this.prisma);
        this.classes = buildClassPersistence(this.prisma);
        this.assignments = buildAssignmentPersistence(this.prisma)
    }
}

