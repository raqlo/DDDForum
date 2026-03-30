import express from "express";
import cors from "cors";
import {ClassController} from "./classes/controller";
import {AssignmentController,} from "./assignments/controller";
import {StudentController} from "./students/controller";
import {errorHandler} from "./shared/errors/errors";
import {StudentService} from "./students/service";

const app = express();
app.use(express.json());
app.use(cors());

export function isMissingKeys(data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
        if (data[key] === undefined) return true;
    }
    return false;
}

export function parseForResponse(data: unknown) {
    return JSON.parse(JSON.stringify(data));
}

export function isUUID(id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id
    );
}

const studentService = new StudentService();

const classController = new ClassController(errorHandler);
const assignmentController = new AssignmentController(errorHandler);
const studentController = new StudentController(errorHandler, studentService);

// API Endpoints

app.post("/students", studentController.createStudent.bind(studentController));

app.post("/classes", classController.createClass);

app.post("/class-enrollments", classController.createClassEnrollment);

app.post("/assignments", assignmentController.createAssignment.bind(assignmentController));

app.post("/student-assignments", assignmentController.createStudentAssignment.bind(assignmentController));

app.post("/student-assignments/submit", assignmentController.submitStudentAssignment.bind(assignmentController));

app.post("/student-assignments/grade", assignmentController.gradeStudentAssignment.bind(assignmentController));


app.get("/students", studentController.getListOfStudents.bind(studentController));

app.get("/students/:id", studentController.getStudentById.bind(studentController));

app.get("/assignments/:id", assignmentController.getAssignmentById.bind(assignmentController));

app.get("/classes/:id/assignments", classController.getListOfAssignmentsByClass);

app.get("/student/:id/assignments", studentController.getListOfAssignmentsByStudent.bind(studentController));

app.get("/student/:id/grades", studentController.getListOfStudentGrades.bind(studentController));

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export {app};
