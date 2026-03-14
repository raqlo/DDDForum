import express, {Request, Response} from "express";
import {CreateStudentDTO} from "../views";
import {prisma} from "../database";
import {Errors, isUUID, parseForResponse} from "../controllers";
import {ErrorHandler} from "../shared/errors/errorHandler";
import {StudentsService} from "../services/studentServices";


class StudentsController {
    private router: express.Router;

    constructor(
        private studentsService: StudentsService,
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

    private async createStudent (req: Request, res: Response) {
        try {

            const {name} = CreateStudentDTO.fromRequest(req.body);

            const student = await this.studentsService.createStudent(name)

            res.status(201).json({error: undefined, data: parseForResponse(student), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async getStudentList (req: Request, res: Response) {
        try {
            const students = await this.studentsService.getStudentList()
            res.status(200).json({error: undefined, data: parseForResponse(students), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async getStudentById (req: Request, res: Response) {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
            }
            const student = await this.studentsService.getStudentById(id)

            if (!student) {
                return res.status(404).json({error: Errors.StudentNotFound, data: undefined, success: false});
            }

            res.status(200).json({error: undefined, data: parseForResponse(student), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async getStudentsGradesList(req: Request, res: Response) {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
            }

            // check if student exists
            const student = await this.studentsService.getStudentById(id)

            if (!student) {
                return res.status(404).json({error: Errors.StudentNotFound, data: undefined, success: false});
            }

            const studentAssignments = await this.studentsService.getStudentGrades(id)

            res.status(200).json({error: undefined, data: parseForResponse(studentAssignments), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
}

