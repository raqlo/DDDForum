import express, {Request, Response} from "express";
import {AssignStudentToClassDTO, CreateClassDTO} from "../views";
import {prisma} from "../database";
import {Errors, isUUID, parseForResponse} from "../controllers";
import {ErrorHandler} from "../shared/errors/errorHandler";

class ClassesController {
    private router: express.Router;

    constructor(private errorHandler: ErrorHandler) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler()
    }

    private setupRoutes() {
        this.router.post("/", this.createClass);
        this.router.post("/:id/students", this.assignStudentToClass);
        this.router.get("/:id/assignments", this.getAssignmentListByClass);
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler);
    }

    private createClass = CreateClassController;
    private assignStudentToClass = AssignStudentToClassController;
    private getAssignmentListByClass = GetAssignmentListByClassController;
}

export async function CreateClassController(req: Request, res: Response) {
    try {
        const {name} = CreateClassDTO.fromRequest(req.body);

        const cls = await prisma.class.create({
            data: {
                name
            }
        });

        res.status(201).json({error: undefined, data: parseForResponse(cls), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}

export async function AssignStudentToClassController(req: Request, res: Response) {
    try {
        const {studentId, classId} = AssignStudentToClassDTO.fromRequest(req.body);

        // check if student exists
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        });

        if (!student) {
            return res.status(404).json({error: Errors.StudentNotFound, data: undefined, success: false});
        }

        // check if class exists
        const cls = await prisma.class.findUnique({
            where: {
                id: classId
            }
        });

        // check if student is already enrolled in class
        const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
            where: {
                studentId,
                classId
            }
        });

        if (duplicatedClassEnrollment) {
            return res.status(400).json({error: Errors.StudentAlreadyEnrolled, data: undefined, success: false});
        }

        if (!cls) {
            return res.status(404).json({error: Errors.ClassNotFound, data: undefined, success: false});
        }

        const classEnrollment = await prisma.classEnrollment.create({
            data: {
                studentId,
                classId
            }
        });

        res.status(201).json({error: undefined, data: parseForResponse(classEnrollment), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}

export async function GetAssignmentListByClassController(req: Request, res: Response) {
    try {
        const {id} = req.params;
        if (!isUUID(id)) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        // check if class exists
        const cls = await prisma.class.findUnique({
            where: {
                id
            }
        });

        if (!cls) {
            return res.status(404).json({error: Errors.ClassNotFound, data: undefined, success: false});
        }

        const assignments = await prisma.assignment.findMany({
            where: {
                classId: id
            },
            include: {
                class: true,
                studentTasks: true
            }
        });

        res.status(200).json({error: undefined, data: parseForResponse(assignments), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}