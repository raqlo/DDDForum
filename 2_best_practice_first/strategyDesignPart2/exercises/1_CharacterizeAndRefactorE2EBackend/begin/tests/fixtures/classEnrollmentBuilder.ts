import {StudentBuilder} from "./studentBuilder";
import {ClassBuilder} from "./classBuilder";
import {prisma} from "../../src/database";
import {ClassEnrollment} from "./types";

export class ClassEnrollmentBuilder {
    private student?: StudentBuilder;
    private classroom?: ClassBuilder;

    withStudent(student: StudentBuilder) {
        this.student = student;
        return this;
    }

    withClass(classroom: ClassBuilder) {
        this.classroom = classroom;
        return this;
    }

    async build() {
        if(!this.student) {
            throw new Error('Student builder is required');
        }
        if(!this.classroom) {
            throw new Error('Classroom builder is required');
        }

        const student = await this.student.build();
        const classroom = await this.classroom.build();

        return prisma.classEnrollment.create({
            data: {
                studentId: student.id,
                classId: classroom.id,
            },
        }) as unknown as Promise<ClassEnrollment>;
    }
}