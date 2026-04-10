import {PrismaClient} from '@prisma/client';
import {StudentPersistence, StudentRepository} from './students/repository';
import {ClassPersistence, ClassRepository} from './classes/repository';
import {AssignmentPersistence, AssignmentRepository} from './assignments/repository';

export class Database {
    public students: StudentPersistence;
    public classes: ClassPersistence;
    public assignments: AssignmentPersistence;

    constructor(private prisma: PrismaClient) {
        this.students = new StudentRepository(prisma);
        this.classes = new ClassRepository(prisma);
        this.assignments = new AssignmentRepository(prisma);
    }
}