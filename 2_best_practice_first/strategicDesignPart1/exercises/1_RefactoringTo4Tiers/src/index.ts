import express, {Request, Response} from 'express';
import {
    AssignStudentToClassController, ClassesController,
    CreateClassController,
    GetAssignmentListByClassController
} from "./controllers/classesController";
import {
    AssignmentsController,
    AssignStudentToAssignmentController,
    CreateAssignmentController,
    GetAssignmentByIdController,
    GetAssignmentsSubmittedByStudentsController,
    GradeStudentAssignmentController,
    SubmitStudentAssignmentController
} from "./controllers/assignmentsController";
import {CreateStudentDTO} from "./views";
import {StudentsService} from "./services/studentServices";
import {Errors, isUUID, parseForResponse} from "./controllers";
import {Database} from "./database";
import {PrismaClient} from "@prisma/client";
import {ClassesService} from "./services/classesService";
import {AssignmentsService} from "./services/assignmentsService";
import {errorHandler} from "./shared/errors/errorHandler";
import {StudentsController} from "./controllers/studentsController";

const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// API Endpoints

const prisma = new PrismaClient();

const db = new Database(prisma);

const studentsService = new StudentsService(db);
const classesService = new ClassesService(db);
const assignmentsService = new AssignmentsService(db);

const studentsController = new StudentsController(
    studentsService,
    errorHandler
);
const classesController = new ClassesController(classesService, errorHandler);
const assignmentsController = new AssignmentsController(
    assignmentsService,
    errorHandler
);

// POST student created
app.post('/students', async function (req: Request, res: Response) {
    try {

        const {name} = CreateStudentDTO.fromRequest(req.body);

        const student = StudentsService.create

        res.status(201).json({error: undefined, data: parseForResponse(student), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
})

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
app.get('/students', async function (req: Request, res: Response) {
    try {
        const students = await prisma.student.findMany({
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.status(200).json({error: undefined, data: parseForResponse(students), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
});


// GET a student by id
app.get('/students/:id', async function (req: Request, res: Response) {
    try {
        const {id} = req.params;
        if (!isUUID(id)) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }
        const student = await prisma.student.findUnique({
            where: {
                id
            },
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            }
        });

        if (!student) {
            return res.status(404).json({error: Errors.StudentNotFound, data: undefined, success: false});
        }

        res.status(200).json({error: undefined, data: parseForResponse(student), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
});


// GET assignment by id
app.get('/assignments/:id', GetAssignmentByIdController);


// GET all assignments for class
app.get('/classes/:id/assignments', GetAssignmentListByClassController);


// GET all student submitted assignments
app.get('/student/:id/assignments', GetAssignmentsSubmittedByStudentsController);


// GET all student grades
app.get('/student/:id/grades', async function (req: Request, res: Response) {
    try {
        const {id} = req.params;
        if (!isUUID(id)) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        // check if student exists
        const student = await prisma.student.findUnique({
            where: {
                id
            }
        });

        if (!student) {
            return res.status(404).json({error: Errors.StudentNotFound, data: undefined, success: false});
        }

        const studentAssignments = await prisma.studentAssignment.findMany({
            where: {
                studentId: id,
                status: 'submitted',
                grade: {
                    not: null
                }
            },
            include: {
                assignment: true
            },
        });

        res.status(200).json({error: undefined, data: parseForResponse(studentAssignments), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
