import {AssignmentBuilder} from "./assignmentBuilder";
import {prisma} from "../../src/database";
import {StudentAssignment} from "./types";

export class StudentAssignmentBuilder {
    private assignment?: AssignmentBuilder;
    private student?: string;

    withAssignment(assignment: AssignmentBuilder) {
        this.assignment = assignment;
        return this;
    }

    withStudentId(student: string) {
        this.student = student;
        return this;
    }

    async build() {
        if (!this.assignment) {
            throw new Error('Assignment builder is required');
        }
        if (!this.student) {
            throw new Error('Student builder is required');
        }

        const assignment = await this.assignment.build();

        return prisma.studentAssignment.create({
            data: {
                studentId: this.student,
                assignmentId: assignment.id,
            },
        }) as unknown as Promise<StudentAssignment>;
    }
}