import express from "express";
import cors from "cors";
import {
  ClassController

} from "./classes/controller";
import {
  CreateAssignmentController,
  CreateStudentAssignment,
  GetAssignmentById, GradeStudentAssignment,
  SubmitStudentAssignment
} from "./assgnments/controller";
import {
  CreateStudentController,
  GetListOfAssignmentsByStudent,
  GetListOfStudentGrades,
  GetListOfStudentsController,
  GetStudentByIdController
} from "./students/controller";

const app = express();
app.use(express.json());
app.use(cors());

export const Errors = {
  ValidationError: "ValidationError",
  StudentNotFound: "StudentNotFound",
  ClassNotFound: "ClassNotFound",
  ClassAlreadyExists: "ClassAlreadyExists",
  AssignmentNotFound: "AssignmentNotFound",
  ServerError: "ServerError",
  ClientError: "ClientError",
  StudentAlreadyEnrolled: "StudentAlreadyEnrolled",
  StudentNotEnrolled: "StudentNotEnrolled",
  AssignmentAlreadySubmitted: "AssignmentAlreadySubmitted",
  NotSubmittedError: "NotSubmittedError",
  AlreadyAssignedAssignmentToStudent: 'AlreadyAssignedAssignmentToStudent',
  AlreadyGradedAssignment: 'AlreadyGradedAssignment'
};

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

// API Endpoints

app.post("/students", CreateStudentController);

app.post("/classes", classController.createClass);

app.post("/class-enrollments", classController.createClassEnrollment);

app.post("/assignments", CreateAssignmentController);

app.post("/student-assignments", CreateStudentAssignment);

app.post("/student-assignments/submit", SubmitStudentAssignment);

app.post("/student-assignments/grade", GradeStudentAssignment);


app.get("/students", GetListOfStudentsController);

app.get("/students/:id", GetStudentByIdController);

app.get("/assignments/:id", GetAssignmentById);

app.get("/classes/:id/assignments", classController.getListOfAssignmentsByClass);

app.get("/student/:id/assignments", GetListOfAssignmentsByStudent);

app.get("/student/:id/grades", GetListOfStudentGrades);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export { app };
