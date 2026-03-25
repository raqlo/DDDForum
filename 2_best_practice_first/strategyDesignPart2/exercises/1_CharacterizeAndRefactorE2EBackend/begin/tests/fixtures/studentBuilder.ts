import {prisma} from "../../src/database";

export type Student = { id: string, name: string, email: string };

export class StudentBuilder {
    private props: StudentProps;

    constructor() {
        this.props = {
            name: '',
            email: '',
        }
    }

    withName(name: string) {
        this.props.name = name;
        return this;
    }

    withEmail(email: string) {
        this.props.email = email;
        return this;
    }

    build() {
        return prisma.student.create({
            data: {
                name: this.props.name,
                email: this.props.email,
            },
        }) as unknown as Promise<Student>;
    }
}

type StudentProps = { name: string, email: string };