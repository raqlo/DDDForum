import express, {Request, Response} from "express";
import {AssignStudentToClassDTO, CreateClassDTO} from "../views";
import {prisma} from "../database";
import {Errors, isUUID, parseForResponse} from "../controllers";
import {ErrorHandler} from "../shared/errors/errorHandler";
import {ClassesServices} from "../services/classesServices";

export class ClassesController {
    private router: express.Router;

    constructor(private classesService: ClassesServices, private errorHandler: ErrorHandler) {
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

    private async createClass (req: Request, res: Response) {
        try {
            const {name} = CreateClassDTO.fromRequest(req.body);

            const cls = await this.classesService.createClass(name)

            res.status(201).json({error: undefined, data: parseForResponse(cls), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async assignStudentToClass (req: Request, res: Response) {
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
            const cls = await this.classesService.getClassById(classId)

            // check if student is already enrolled in class
            const duplicatedClassEnrollment = await this.classesService.findDuplicateClassEnrollment(studentId, classId)

            if (duplicatedClassEnrollment) {
                return res.status(400).json({error: Errors.StudentAlreadyEnrolled, data: undefined, success: false});
            }

            if (!cls) {
                return res.status(404).json({error: Errors.ClassNotFound, data: undefined, success: false});
            }

            const classEnrollment = await this.classesService.createClassEnrollment(studentId, classId,)

            res.status(201).json({error: undefined, data: parseForResponse(classEnrollment), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async getAssignmentListByClass (req: Request, res: Response) {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
            }

            // check if class exists
            const cls = await this.classesService.getClassById(id)

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
    };
}

