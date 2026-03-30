import {Classroom} from "./types";
import {testDb} from "./testDatabase";

type ClassProps = { name: string };

export class ClassBuilder {
    private props: ClassProps;
    constructor() {
        this.props = {
            name: '',
        }
    }

    withName(name: string) {
        this.props.name = name;
        return this;
    }

    build() {
        return testDb.classes.save(this.props.name) as unknown as Promise<Classroom>;
    }
}