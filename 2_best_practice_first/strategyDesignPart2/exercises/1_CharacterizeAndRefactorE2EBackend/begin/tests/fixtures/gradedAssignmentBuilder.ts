import {GradedAssignment} from "./types";
import {testDb} from "./testDatabase";

export class GradedAssignmentBuilder {
    private props: { assignmentSubmissionId: string, grade: string; } = {
        assignmentSubmissionId: '',
        grade: '',
    }

    withAssignmentSubmissionId(assignmentSubmissionId: string) {
        this.props.assignmentSubmissionId = assignmentSubmissionId;
        return this;
    }

    withGrade(grade: string) {
        this.props.grade = grade;
        return this;
    }

    build() {
        return testDb.assignments.createGradedAssignment(this.props.assignmentSubmissionId, this.props.grade) as Promise<GradedAssignment>;
    }
}
