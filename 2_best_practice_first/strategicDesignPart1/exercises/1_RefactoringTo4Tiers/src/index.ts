import express, { Request, Response } from 'express';
import { prisma } from './database';
import { Student, Class, Assignment, StudentAssignment } from '@prisma/client';
import { error } from 'console';
import {
    AssignStudentToAssignmentController,
    AssignStudentToClassController,
    CreateAssignmentController,
    CreateClassController,
    CreateStudentController, GetAssignmentById, GetAssignmentListByClassController,
    GetAssignmentsSubmittedByStudentsController, GetStudentById,
    GetStudentListController,
    GetStudentsGradesListController, GradeStudentAssignmentController, SubmitStudentAssignmentController
} from "./controllers";
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const Errors = {
    ValidationError: 'ValidationError',
    StudentNotFound: 'StudentNotFound',
    ClassNotFound: 'ClassNotFound',
    AssignmentNotFound: 'AssignmentNotFound',
    ServerError: 'ServerError',
    ClientError: 'ClientError',
    StudentAlreadyEnrolled: 'StudentAlreadyEnrolled'
  }


function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    }
    return false;
}

function parseForResponse(data: unknown) {
    return JSON.parse(JSON.stringify(data));
}

function isUUID (id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

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
app.get('/students/:id', GetStudentById);


// GET assignment by id
app.get('/assignments/:id', GetAssignmentById);


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
