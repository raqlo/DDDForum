import express from 'express';
import { prisma } from './database';
import { Student, Class, Assignment, StudentAssignment } from '@prisma/client';
import { error } from 'console';
import {
    CreateStudentController,
    GetStudentByIdController,
    GetStudentListController,
    GetStudentsGradesListController
} from "./controllers/studentsController";
import {
    AssignStudentToClassController,
    CreateClassController,
    GetAssignmentListByClassController
} from "./controllers/classesController";
import {
    AssignStudentToAssignmentController, CreateAssignmentController,
    GetAssignmentByIdController,
    GetAssignmentsSubmittedByStudentsController, GradeStudentAssignmentController, SubmitStudentAssignmentController
} from "./controllers/assignmentsController";
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// API Endpoints

// POST student created
app.post('/students', CreateStudentController)

// POST class created
app.post('/classes', CreateClassController);


// POST student assigned to class
app.post('/class-enrollments', AssignStudentToClassController);


// POST assignment created
app.post('/assignments', CreateAssignmentController);


// POST student assigned to assignment
app.post('/student-assignments', AssignStudentToAssignmentController);


// POST student submitted assignment
app.post('/student-assignments/submit', SubmitStudentAssignmentController);


// POST student assignment graded
app.post('/student-assignments/grade', GradeStudentAssignmentController);


// GET all students
app.get('/students', GetStudentListController);


// GET a student by id
app.get('/students/:id', GetStudentByIdController);


// GET assignment by id
app.get('/assignments/:id', GetAssignmentByIdController);


// GET all assignments for class
app.get('/classes/:id/assignments', GetAssignmentListByClassController);


// GET all student submitted assignments
app.get('/student/:id/assignments', GetAssignmentsSubmittedByStudentsController);


// GET all student grades
app.get('/student/:id/grades', GetStudentsGradesListController)


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
