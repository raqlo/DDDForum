import express from "express";
import cors from "cors";
import {
  ClassController

} from "./classes/controller";
import {
  AssignmentController,
} from "./assignments/controller";
import {
 StudentController
} from "./students/controller";

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

const classController = new ClassController();
const assignmentController = new AssignmentController();
const studentController = new StudentController();

// API Endpoints

app.post("/students", studentController.createStudent);

app.post("/classes", classController.createClass);

app.post("/class-enrollments", classController.createClassEnrollment);

app.post("/assignments", assignmentController.createAssignment.bind(assignmentController));

app.post("/student-assignments", assignmentController.createStudentAssignment.bind(assignmentController));

app.post("/student-assignments/submit", assignmentController.submitStudentAssignment.bind(assignmentController));

app.post("/student-assignments/grade", assignmentController.gradeStudentAssignment.bind(assignmentController));


app.get("/students", studentController.getListOfStudents);

app.get("/students/:id", studentController.getStudentById);

app.get("/assignments/:id", assignmentController.getAssignmentById.bind(assignmentController));

app.get("/classes/:id/assignments", classController.getListOfAssignmentsByClass);

app.get("/student/:id/assignments", studentController.getListOfAssignmentsByStudent);

app.get("/student/:id/grades", studentController.getListOfStudentGrades);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export { app };
