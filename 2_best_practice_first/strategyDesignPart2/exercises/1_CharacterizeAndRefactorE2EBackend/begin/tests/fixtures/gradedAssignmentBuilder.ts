import {prisma} from "../../src/database";

export type GradedAssignment = { id: string, assignmentSubmissionId: string, grade: string | null };

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
        return prisma.gradedAssignment.create({
            data: {
                grade: this.props.grade,
                assignmentSubmissionId: this.props.assignmentSubmissionId
            }
        }) as Promise<GradedAssignment>;
    }
}