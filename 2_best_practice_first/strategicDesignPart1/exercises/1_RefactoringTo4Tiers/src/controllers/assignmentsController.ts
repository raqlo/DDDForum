import express, {Request, Response} from "express";
import {AssignStudentDTO, CreateAssignmentDTO, GradeStudentAssignmentDTO, SubmitStudentAssignmentDTO} from "../views";
import {Errors, isUUID, parseForResponse} from "../controllers";
import {ErrorHandler} from "../shared/errors/errorHandler";
import {AssignmentsService} from "../services/assignmentsService";
import {StudentsService} from "../services/studentServices";

class AssignmentsController {
    private router: express.Router;

    constructor(
        private assignmentsService: AssignmentsService,
        private studentsService: StudentsService,
        private errorHandler: ErrorHandler
    ) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    private setupRoutes() {
        this.router.post("/", this.createAssignment);
        this.router.post("/:id/students", this.assignStudentToAssignment);
        this.router.post("/:id/submit", this.submitStudentAssignment);
        this.router.post("/:id/grade", this.gradeStudentAssignment);
        this.router.get("/:id", this.getAssignmentById);
        this.router.get("/:id/students", this.getAssignmentsSubmittedByStudents);
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler);
    }

    private async createAssignment (req: Request, res: Response) {
        try {
            const {classId, title} = CreateAssignmentDTO.fromRequest(req.body);

            const assignment = await this.assignmentsService.createAssignment(classId, title)

            res.status(201).json({error: undefined, data: parseForResponse(assignment), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async assignStudentToAssignment (req: Request, res: Response) {
        try {
            const {studentId, assignmentId} = AssignStudentDTO.fromRequest(req.body);

            // check if student exists
            const student = await this.studentsService.getStudentById(studentId)

            if (!student) {
                return res.status(404).json({error: Errors.StudentNotFound, data: undefined, success: false});
            }

            // check if assignment exists
            const assignment = await this.assignmentsService.getAssignmentById(assignmentId)

            if (!assignment) {
                return res.status(404).json({error: Errors.AssignmentNotFound, data: undefined, success: false});
            }

            const studentAssignment = this.assignmentsService.createStudentAssignment(studentId, assignmentId)

            res.status(201).json({error: undefined, data: parseForResponse(studentAssignment), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async submitStudentAssignment  (req: Request, res: Response) {
        try {
            const {id} = SubmitStudentAssignmentDTO.fromRequest(req.body);

            // check if student assignment exists
            const studentAssignment = await this.assignmentsService.getStudentAssignmentById(id)

            if (!studentAssignment) {
                return res.status(404).json({error: Errors.AssignmentNotFound, data: undefined, success: false});
            }

            const studentAssignmentUpdated = await this.assignmentsService.updateStudentAssignment(id)

            res.status(200).json({error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async gradeStudentAssignment(req: Request, res: Response) {
        try {
            const {id, grade} = GradeStudentAssignmentDTO.fromRequest(req.body);

            // validate grade
            if (!['A', 'B', 'C', 'D'].includes(grade)) {
                return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
            }

            // check if student assignment exists
            const studentAssignment = await this.assignmentsService.getStudentAssignmentById(id)

            if (!studentAssignment) {
                return res.status(404).json({error: Errors.AssignmentNotFound, data: undefined, success: false});
            }

            const studentAssignmentUpdated = await this.assignmentsService.updateStudentAssignmentGrade(id, grade)

            res.status(200).json({error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async getAssignmentById (req: Request, res: Response) {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
            }
            const assignment = await this.assignmentsService.getAssignmentWithClass(id)

            if (!assignment) {
                return res.status(404).json({error: Errors.AssignmentNotFound, data: undefined, success: false});
            }

            res.status(200).json({error: undefined, data: parseForResponse(assignment), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    private async getAssignmentsSubmittedByStudents (req: Request, res: Response) {
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

            const studentAssignments = await this.assignmentsService.getListOfStudentAssignments(student.id)

            res.status(200).json({error: undefined, data: parseForResponse(studentAssignments), success: true});
        } catch (error) {
            res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
}

