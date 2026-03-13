import {
    AssignStudentToClassController,
    CreateAssignmentController,
    SubmitStudentAssignmentController
} from "./controllers";

function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
        if (data[key] === undefined) return true;
    }
    return false;
}

export class AssignStudentDTO {
    constructor(public studentId: string, public assignmentId: string) {}

    static fromRequest(body: unknown) {
        const requiredKeys = ["studentId", "assignmentId"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new Error('missing required keys in request body:');
        }

        const { studentId, assignmentId } = body as AssignStudentDTO;

        return new AssignStudentDTO(studentId, assignmentId);
    }
}

export class CreateStudentDTO {
    constructor(public name: string) {}

    static fromRequest(body: unknown) {
        const requiredKeys = ["name"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new Error('missing required keys in request body:');
        }

        const { name } = body as CreateStudentDTO;

        return new CreateStudentDTO(name);
    }
}

export class CreateClassDTO {
    constructor(public name: string) {}

    static fromRequest(body: unknown) {
        const requiredKeys = ["name"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new Error('missing required keys in request body:');
        }

        const { name } = body as CreateClassDTO;

        return new CreateClassDTO(name);
    }
}

export class AssignStudentToClassDTO {
    constructor(public studentId: string, public classId: string) {}

    static fromRequest(body: unknown) {
        const requiredKeys = ['studentId', 'classId'];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new Error('missing required keys in request body:');
        }

        const { studentId, classId } = body as AssignStudentToClassDTO;

        return new AssignStudentToClassDTO(studentId, classId);
    }
}


export class CreateAssignmentDTO {
    constructor(public classId: string, public title: string) {}

    static fromRequest(body: unknown) {
        const requiredKeys = ['classId', 'title'];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new Error('missing required keys in request body:');
        }

        const { title, classId } = body as CreateAssignmentDTO;

        return new CreateAssignmentDTO(title, classId);
    }
}

export class SubmitStudentAssignmentDTO {
    constructor(public id: string,) {}

    static fromRequest(body: unknown) {
        const requiredKeys = ['id'];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new Error('missing required keys in request body:');
        }

        const { id } = body as SubmitStudentAssignmentDTO;

        return new SubmitStudentAssignmentDTO(id);
    }
}