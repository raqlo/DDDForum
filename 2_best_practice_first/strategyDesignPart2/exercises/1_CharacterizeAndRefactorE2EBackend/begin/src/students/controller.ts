// POST student created
import express, {Request, Response, Router} from "express";
import {isMissingKeys, isUUID, parseForResponse} from "../index";
import Errors from "../shared/errors/constants";
import {ErrorHandler} from "../shared/errors/errors";
import {StudentService} from "./service";


export class StudentController {
    private router: Router;

    constructor(
        private errorHandler: ErrorHandler,
        private studentService: StudentService) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    async createStudent(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ["name", "email"])) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            const {name, email} = req.body;
            const student = await this.studentService.createStudent(name, email);

            res.status(201).json({
                error: undefined,
                data: parseForResponse(student),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    }

    async getListOfStudents(req: Request, res: Response) {

// GET all students
        try {
            const students = await this.studentService.GetAllStudents()
            res.status(200).json({
                error: undefined,
                data: parseForResponse(students),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    }


    // GET a student by id
    async getStudentById(req: Request, res: Response) {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }
            const student = await this.studentService.getStudentById(id);

            if (!student) {
                return res.status(404).json({
                    error: Errors.StudentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            res.status(200).json({
                error: undefined,
                data: parseForResponse(student),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    }

    // GET all student submitted assignments
    async getListOfAssignmentsByStudent(req: Request, res: Response) {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            // check if student exists
            const student = await this.studentService.getStudentById(id)

            if (!student) {
                return res.status(404).json({
                    error: Errors.StudentNotFound,
                    data: undefined,
                    success: false,
                });
            }
            const studentAssignments = await this.studentService.getListOfAssignmentsByStudent(id);

            res.status(200).json({
                error: undefined,
                data: parseForResponse(studentAssignments),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    }

    // GET all student grades
    async getListOfStudentGrades(req: Request, res: Response) {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            // check if student exists
            const student = await this.studentService.getStudentById(id)

            if (!student) {
                return res.status(404).json({
                    error: Errors.StudentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            const gradedAssignments = await this.studentService.getListOfStudentGrades(id);

            res.status(200).json({
                error: undefined,
                data: parseForResponse(gradedAssignments),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    }


    getRouter() {
        return this.router;
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler);
    }

    private setupRoutes() {
        this.router.post("/", this.createStudent.bind(this));
        this.router.get("/", this.getListOfStudents.bind(this));
        this.router.get("/:id", this.getStudentById.bind(this));
        this.router.get("/:id/assignments", this.getListOfAssignmentsByStudent.bind(this));
        this.router.get("/:id/grades", this.getListOfStudentGrades.bind(this));
    }
}