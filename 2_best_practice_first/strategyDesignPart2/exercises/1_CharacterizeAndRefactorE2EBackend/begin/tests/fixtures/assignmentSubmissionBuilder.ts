import {AssignmentSubmission} from "./types";
import {testDb} from "./testDatabase";

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

        return testDb.assignments.createAssignmentSubmission(this.studentAssignmentId) as unknown as Promise<AssignmentSubmission>;
    }
}
