import express, {Request, Response} from "express";
import {AssignStudentDTO, CreateAssignmentDTO, GradeStudentAssignmentDTO, SubmitStudentAssignmentDTO} from "../views";
import {prisma} from "../database";
import {Errors, isUUID, parseForResponse} from "../controllers";
import {ErrorHandler} from "../shared/errors/errorHandler";

class AssignmentsController {
    private router: express.Router;

    constructor(
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

    private createAssignment = CreateAssignmentController;
    private assignStudentToAssignment = AssignStudentToAssignmentController;
    private submitStudentAssignment = SubmitStudentAssignmentController;
    private gradeStudentAssignment = GradeStudentAssignmentController;
    private getAssignmentById = GetAssignmentByIdController;
    private getAssignmentsSubmittedByStudents = GetAssignmentsSubmittedByStudentsController;
}

export async function CreateAssignmentController(req: Request, res: Response) {
    try {
        const {classId, title} = CreateAssignmentDTO.fromRequest(req.body);

        const assignment = await prisma.assignment.create({
            data: {
                classId,
                title
            }
        });

        res.status(201).json({error: undefined, data: parseForResponse(assignment), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}

export async function AssignStudentToAssignmentController(req: Request, res: Response) {
    try {
        const {studentId, assignmentId} = AssignStudentDTO.fromRequest(req.body);

        // check if student exists
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        });

        if (!student) {
            return res.status(404).json({error: Errors.StudentNotFound, data: undefined, success: false});
        }

        // check if assignment exists
        const assignment = await prisma.assignment.findUnique({
            where: {
                id: assignmentId
            }
        });

        if (!assignment) {
            return res.status(404).json({error: Errors.AssignmentNotFound, data: undefined, success: false});
        }

        const studentAssignment = await prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            }
        });

        res.status(201).json({error: undefined, data: parseForResponse(studentAssignment), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}

export async function SubmitStudentAssignmentController(req: Request, res: Response) {
    try {
        const {id} = SubmitStudentAssignmentDTO.fromRequest(req.body);

        // check if student assignment exists
        const studentAssignment = await prisma.studentAssignment.findUnique({
            where: {
                id
            }
        });

        if (!studentAssignment) {
            return res.status(404).json({error: Errors.AssignmentNotFound, data: undefined, success: false});
        }

        const studentAssignmentUpdated = await prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                status: 'submitted'
            }
        });

        res.status(200).json({error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}

export async function GradeStudentAssignmentController(req: Request, res: Response) {
    try {
        const {id, grade} = GradeStudentAssignmentDTO.fromRequest(req.body);

        // validate grade
        if (!['A', 'B', 'C', 'D'].includes(grade)) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        // check if student assignment exists
        const studentAssignment = await prisma.studentAssignment.findUnique({
            where: {
                id
            }
        });

        if (!studentAssignment) {
            return res.status(404).json({error: Errors.AssignmentNotFound, data: undefined, success: false});
        }

        const studentAssignmentUpdated = await prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                grade,
            }
        });

        res.status(200).json({error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}

export async function GetAssignmentByIdController(req: Request, res: Response) {
    try {
        const {id} = req.params;
        if (!isUUID(id)) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }
        const assignment = await prisma.assignment.findUnique({
            include: {
                class: true,
                studentTasks: true
            },
            where: {
                id
            }
        });

        if (!assignment) {
            return res.status(404).json({error: Errors.AssignmentNotFound, data: undefined, success: false});
        }

        res.status(200).json({error: undefined, data: parseForResponse(assignment), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}

export async function GetAssignmentsSubmittedByStudentsController(req: Request, res: Response) {
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
                status: 'submitted'
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