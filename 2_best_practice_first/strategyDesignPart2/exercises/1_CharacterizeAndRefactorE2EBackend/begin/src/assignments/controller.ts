// POST assignment created
import express, {Request, Response, Router} from "express";
import Errors from "../shared/errors/constants";
import {ErrorHandler} from "../shared/errors/errors";
import {StudentService} from "../students/service";
import {ClassService} from "../classes/service";
import {AssignmentService} from "./service";
import {isUUID, parseForResponse} from "../shared/utils/utils";
import {CreateAssignmentDTO} from "./dtos/CreateAssignmentDTO";
import {CreateStudentAssignmentDTO} from "./dtos/CreateStudentAssignmentDTO";
import {SubmitStudentAssignmentDTO} from "./dtos/SubmitStudentAssignmentDTO";
import {GradeStudentAssignmentDTO} from "./dtos/GradeStudentAssignmentDTO";

export class AssignmentController {
    private router: Router;

    constructor(
        private errorHandler: ErrorHandler,
        private assignmentService: AssignmentService,
        private studentService: StudentService,
        private classService: ClassService
    ) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    createAssignment = async (req: Request, res: Response) => {
        try {
            const dto = CreateAssignmentDTO.fromRequest(req.body);
            const assignment = await this.assignmentService.createAssignment(dto.classId, dto.title);

            res.status(201).json({
                error: undefined,
                data: parseForResponse(assignment),
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

    // POST student assigned to assignment
    createStudentAssignment = async (req: Request, res: Response) => {
        try {
            const dto = CreateStudentAssignmentDTO.fromRequest(req.body);

            // check if student exists
            const student = await this.studentService.getStudentById(dto.studentId);

            if (!student) {
                return res.status(404).json({
                    error: Errors.StudentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            // check if assignment exists
            const assignment = await this.assignmentService.getAssignmentById(dto.assignmentId);

            if (!assignment) {
                return res.status(404).json({
                    error: Errors.AssignmentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            const studentEnrolled = await this.classService.getClassEnrollment(dto.studentId, assignment.classId);

            if (!studentEnrolled) {
                return res.status(404).json({
                    error: Errors.StudentNotEnrolled,
                    data: undefined,
                    success: false,
                });
            }

            const alreadyAssignedAssignment = await this.assignmentService.getStudentAssignment(dto.studentId, dto.assignmentId);

            if (alreadyAssignedAssignment) {
                return res.status(409).json({
                    error: Errors.AlreadyAssignedAssignmentToStudent,
                    data: undefined,
                    success: false,
                });
            }

            const studentAssignment = await this.assignmentService.createStudentAssignment(dto.studentId, dto.assignmentId);

            res.status(201).json({
                error: undefined,
                data: parseForResponse(studentAssignment),
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

    // POST student submitted assignment
    submitStudentAssignment = async (req: Request, res: Response) => {
        try {
            const dto = SubmitStudentAssignmentDTO.fromRequest(req.body);

            // check if student assignment exists
            const studentAssignment = await this.assignmentService.getStudentAssignment(dto.studentId, dto.assignmentId);

            if (!studentAssignment) {
                return res.status(404).json({
                    error: Errors.AssignmentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            // Check if assignment submission exists
            const assignmentSubmission = await this.assignmentService.getAssignmentSubmission(studentAssignment.id);

            if (assignmentSubmission) {
                return res.status(409).json({
                    error: Errors.AssignmentAlreadySubmitted,
                    data: undefined,
                    success: false,
                });
            }

            const studentAssignmentUpdated = await this.assignmentService.createAssignmentSubmission(studentAssignment.id);

            res.status(201).json({
                error: undefined,
                data: parseForResponse(studentAssignmentUpdated),
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

    // GET assignment by id
    getAssignmentById = async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }
            const assignment = await this.assignmentService.getAssignmentById(id, true);

            if (!assignment) {
                return res.status(404).json({
                    error: Errors.AssignmentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            res.status(200).json({
                error: undefined,
                data: parseForResponse(assignment),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    };

    // POST student assignment graded
    gradeStudentAssignment = async (req: Request, res: Response) => {
        try {
            const dto = GradeStudentAssignmentDTO.fromRequest(req.body);

            // check if student assignment exists
            const studentAssignment = await this.assignmentService.getStudentAssignment(dto.studentId, dto.assignmentId);

            if (!studentAssignment) {
                return res.status(404).json({
                    error: Errors.AssignmentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            // Check if student assignment submitted
            const studentAssignmentSubmission = await this.assignmentService.getAssignmentSubmission(studentAssignment.id);

            if (!studentAssignmentSubmission) {
                return res.status(400).json({
                    error: Errors.NotSubmittedError,
                    data: undefined,
                    success: false,
                });
            }

            const alreadyGradedAssignment = await this.assignmentService.getGradedAssignment(dto.assignmentId);

            if (alreadyGradedAssignment) {
                return res.status(409).json({
                    error: Errors.AlreadyGradedAssignment,
                    data: undefined,
                    success: false,
                });
            }

            const studentAssignmentGrade = await this.assignmentService.createGradedAssignment(
                studentAssignmentSubmission.id,
                dto.grade
            );

            res.status(201).json({
                error: undefined,
                data: parseForResponse(studentAssignmentGrade),
                success: true,
            });
        } catch (error) {
            if (error instanceof Error && (error.message.includes("Missing required fields") || error.message.includes("Invalid grade"))) {
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

    getRouter() {
        return this.router;
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler);
    }

    private setupRoutes() {
        this.router.post("/", this.createAssignment);
        this.router.post("/:id/students", this.createStudentAssignment);
        this.router.post("/:id/submit", this.submitStudentAssignment);
        this.router.get("/:id", this.getAssignmentById);
        this.router.post("/:id/grade", this.gradeStudentAssignment);
    }
}