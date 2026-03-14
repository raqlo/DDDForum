import express, {Request, Response} from "express";
import {CreateStudentDTO} from "../views";
import {prisma} from "../database";
import {Errors, isUUID, parseForResponse} from "../controllers";
import {ErrorHandler} from "../shared/errors/errorHandler";


class StudentsController {
    private router: express.Router;

    constructor(
        private errorHandler: ErrorHandler
    ) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler);
    }

    setupRoutes() {
        this.router.post("/", this.createStudent);
        this.router.get("/", this.getStudentList);
        this.router.get("/:id", this.getStudentById);
        this.router.get("/:id/grades", this.getStudentsGradesList);
    }

    private createStudent = CreateStudentController;
    private getStudentList = GetStudentListController;
    private getStudentById = GetStudentByIdController;
    private getStudentsGradesList = GetStudentsGradesListController;
}

export async function CreateStudentController(req: Request, res: Response) {
    try {

        const {name} = CreateStudentDTO.fromRequest(req.body);

        const student = await prisma.student.create({
            data: {
                name
            }
        });

        res.status(201).json({error: undefined, data: parseForResponse(student), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}

export async function GetStudentListController(req: Request, res: Response) {
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
}

export async function GetStudentByIdController(req: Request, res: Response) {
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
}

export async function GetStudentsGradesListController(req: Request, res: Response) {
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
}