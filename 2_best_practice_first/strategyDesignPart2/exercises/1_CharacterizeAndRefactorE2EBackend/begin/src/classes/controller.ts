// POST class created
import express, {Request, Response, Router} from "express";
import Errors from "../shared/errors/constants";
import {ErrorHandler} from "../shared/errors/errors";
import {StudentService} from "../students/service";
import {ClassService} from "./service";
import {isUUID, parseForResponse} from "../shared/utils/utils";
import {CreateClassDTO} from "./dtos/CreateClassDTO";
import {CreateClassEnrollmentDTO} from "./dtos/CreateClassEnrollmentDTO";

export class ClassController {
    private router: Router;
    constructor( private errorHandler: ErrorHandler, private classService: ClassService, private studentService: StudentService, ) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    createClass = async (req: Request, res: Response) => {
        try {
            const dto = CreateClassDTO.fromRequest(req.body);
            const classroomExists = await this.classService.findClassByName(dto.name);

            if (classroomExists) {
                return res
                    .status(409)
                    .json({error: Errors.ClassAlreadyExists, data: undefined, success: false});
            }

            const cls = await this.classService.createClass(dto.name);

            res
                .status(201)
                .json({error: undefined, data: parseForResponse(cls), success: true});
        } catch (error) {
            if (error instanceof Error && error.message.includes("Missing required fields")) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    };

    // POST student assigned to class
    createClassEnrollment = async (req: Request, res: Response) => {
        try {
            const dto = CreateClassEnrollmentDTO.fromRequest(req.body);

            // check if student exists
            const student = await this.studentService.getStudentById(dto.studentId)

            if (!student) {
                return res.status(404).json({
                    error: Errors.StudentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            // check if class exists
            const cls = await this.classService.findClassById(dto.classId)

            // check if student is already enrolled in class
            const duplicatedClassEnrollment = await this.classService.getClassEnrollment(dto.studentId, dto.classId);

            if (duplicatedClassEnrollment) {
                return res.status(409).json({
                    error: Errors.StudentAlreadyEnrolled,
                    data: undefined,
                    success: false,
                });
            }

            if (!cls) {
                return res
                    .status(404)
                    .json({error: Errors.ClassNotFound, data: undefined, success: false});
            }

            const classEnrollment = await this.classService.createEnrollment(dto.studentId, dto.classId);

            res.status(201).json({
                error: undefined,
                data: parseForResponse(classEnrollment),
                success: true,
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes("Missing required fields")) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    };

    // GET all assignments for class
    getListOfAssignmentsByClass = async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            // check if class exists
            const cls = await this.classService.findClassById(id);

            if (!cls) {
                return res
                    .status(404)
                    .json({error: Errors.ClassNotFound, data: undefined, success: false});
            }

            const assignments = await this.classService.getAssignments(id);
            res.status(200).json({
                error: undefined,
                data: parseForResponse(assignments),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    };

    getRouter() {
        return this.router;
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler);
    }

    private setupRoutes() {
        this.router.post("/", this.createClass);
        this.router.post("/enrollments", this.createClassEnrollment);
        this.router.get("/:id/assignments", this.getListOfAssignmentsByClass);
    }
}

