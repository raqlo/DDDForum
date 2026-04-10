import express from "express";
import cors from "cors";
import {ClassController} from "./classes/controller";
import {AssignmentController} from "./assignments/controller";
import {StudentController} from "./students/controller";
import {errorHandler} from "./shared/errors/errors";
import {StudentService} from "./students/service";
import {ClassService} from "./classes/service";
import {AssignmentService} from "./assignments/service";
import {Database} from "./database";
import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient();


const app = express();
app.use(express.json());
app.use(cors());

const db = new Database(prisma);

const studentService = new StudentService(db);
const classService = new ClassService(db);
const assignmentService = new AssignmentService(db);

const studentController = new StudentController(errorHandler, studentService);
const classController = new ClassController(errorHandler, classService, studentService);
const assignmentController = new AssignmentController(errorHandler, assignmentService, studentService, classService);

// API Endpoints

app.post("/students", studentController.createStudent);

app.post("/classes", classController.createClass);

app.post("/class-enrollments", classController.createClassEnrollment);

app.post("/assignments", assignmentController.createAssignment);

app.post("/student-assignments", assignmentController.createStudentAssignment);

app.post("/student-assignments/submit", assignmentController.submitStudentAssignment);

app.post("/student-assignments/grade", assignmentController.gradeStudentAssignment);


app.get("/students", studentController.getListOfStudents);

app.get("/students/:id", studentController.getStudentById);

app.get("/assignments/:id", assignmentController.getAssignmentById);

app.get("/classes/:id/assignments", classController.getListOfAssignmentsByClass);

app.get("/student/:id/assignments", studentController.getListOfAssignmentsByStudent);

app.get("/student/:id/grades", studentController.getListOfStudentGrades);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export {app};
