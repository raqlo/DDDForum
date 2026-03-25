import {prisma} from "../../src/database";
import {AssignmentSubmission} from "./types";

export class AssignmentSubmissionBuilder {
    private studentAssignmentId?: string;

    withStudentAssignmentId(studentAssignmentId: string) {
        this.studentAssignmentId = studentAssignmentId;
        return this;
    }

    async build() {
        if (!this.studentAssignmentId) {
            throw new Error('Student assignment builder is required');
        }

        return prisma.assignmentSubmission.create({
            data: {
                studentAssignmentId: this.studentAssignmentId,
            },
        }) as unknown as Promise<AssignmentSubmission>;
    }
}