import {prisma} from "../../src/database";

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
        return prisma.class.create({
            data: {
                name: this.props.name,
            },
        });
    }
}