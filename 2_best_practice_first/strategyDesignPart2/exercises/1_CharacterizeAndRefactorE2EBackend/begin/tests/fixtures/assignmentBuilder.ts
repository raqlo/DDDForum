import {prisma} from "../../src/database";
import {Assignment} from "./types";

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
        return prisma.assignment.create({
            data: {
                classId: this.props.classId,
                title: this.props.title,
            },
        }) as unknown as Promise<Assignment>;
    }
}