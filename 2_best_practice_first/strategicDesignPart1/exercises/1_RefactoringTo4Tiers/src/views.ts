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