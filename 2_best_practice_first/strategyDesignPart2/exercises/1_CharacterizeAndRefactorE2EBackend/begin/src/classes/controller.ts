// POST class created
import express, {Request, Response, Router} from "express";
import {prisma} from "../database";
import {isMissingKeys, isUUID, parseForResponse} from "../index";
import Errors from "../shared/errors/constants";
import {ErrorHandler} from "../shared/errors/errors";

export class ClassController {
    private router: Router;
    constructor( private errorHandler: ErrorHandler) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    async createClass(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ["name"])) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            const {name} = req.body;

            const classroomExists = await prisma.class.findUnique({where: {name}})

            if (classroomExists) {
                return res
                    .status(409)
                    .json({error: Errors.ClassAlreadyExists, data: undefined, success: false});
            }

            const cls = await prisma.class.create({
                data: {
                    name,
                },
            });

            res
                .status(201)
                .json({error: undefined, data: parseForResponse(cls), success: true});
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    };

    // POST student assigned to class
    async createClassEnrollment(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ["studentId", "classId"])) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            const {studentId, classId} = req.body;

            // check if student exists
            const student = await prisma.student.findUnique({
                where: {
                    id: studentId,
                },
            });

            if (!student) {
                return res.status(404).json({
                    error: Errors.StudentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            // check if class exists
            const cls = await prisma.class.findUnique({
                where: {
                    id: classId,
                },
            });

            // check if student is already enrolled in class
            const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
                where: {
                    studentId,
                    classId,
                },
            });

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

            const classEnrollment = await prisma.classEnrollment.create({
                data: {
                    studentId,
                    classId,
                },
            });

            res.status(201).json({
                error: undefined,
                data: parseForResponse(classEnrollment),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    };

    // GET all assignments for class
    async getListOfAssignmentsByClass(req: Request, res: Response) {
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
            const cls = await prisma.class.findUnique({
                where: {
                    id,
                },
            });

            if (!cls) {
                return res
                    .status(404)
                    .json({error: Errors.ClassNotFound, data: undefined, success: false});
            }

            const assignments = await prisma.assignment.findMany({
                where: {
                    classId: id,
                },
                include: {
                    class: true,
                    studentAssignments: true,
                },
            });

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
        this.router.post("/:id/enroll", this.createClassEnrollment);
        this.router.get("/:id/assignments", this.getListOfAssignmentsByClass);
    }
}

