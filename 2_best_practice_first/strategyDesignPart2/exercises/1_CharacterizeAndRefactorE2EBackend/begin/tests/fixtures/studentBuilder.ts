import {testDb} from "./testDatabase";
import {Student} from "./types";

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
        return testDb.students.save(this.props.name, this.props.email) as unknown as Promise<Student>;
    }
}

type StudentProps = { name: string, email: string };