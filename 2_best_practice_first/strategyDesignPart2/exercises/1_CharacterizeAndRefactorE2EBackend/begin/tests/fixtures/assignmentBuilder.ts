import {Assignment} from "./types";
import {testDb} from "./testDatabase";

export type AssignmentProps = { title: string, classId: string };

export class AssignmentBuilder {
    private props: AssignmentProps;
    constructor() {
        this.props  = {
            title: '',
            classId: '',
        }
    }
    withTitle(title: string) {
        this.props.title = title;
        return this;
    }
    withClassId(classId: string) {
        this.props.classId = classId;
        return this;
    }

    build() {
        return testDb.assignments.save(this.props.classId, this.props.title) as unknown as Promise<Assignment>;
    }
}