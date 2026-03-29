// POST assignment created
import {Request, Response} from "express";
import {prisma} from "../database";
import { isMissingKeys, isUUID, parseForResponse} from "../index";
import Errors from "../shared/errors/constants";

export class AssignmentController {
    async createAssignment(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ["classId", "title"])) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            const {classId, title} = req.body;

            const assignment = await prisma.assignment.create({
                data: {
                    classId,
                    title,
                },
            });

            res.status(201).json({
                error: undefined,
                data: parseForResponse(assignment),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    }

    // POST student assigned to assignment
    async createStudentAssignment(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ["studentId", "assignmentId"])) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            const {studentId, assignmentId} = req.body;

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

            // check if assignment exists
            const assignment = await prisma.assignment.findUnique({
                where: {
                    id: assignmentId,
                },
            });

            if (!assignment) {
                return res.status(404).json({
                    error: Errors.AssignmentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            const studentEnrolled = await prisma.classEnrollment.findFirst({
                where: {
                    studentId,
                    classId: assignment.classId,
                },
            });

            if (!studentEnrolled) {
                return res.status(404).json({
                    error: Errors.StudentNotEnrolled,
                    data: undefined,
                    success: false,
                });
            }

            const alreadyAssignedAssignment = await prisma.studentAssignment.findFirst({
                where: {
                    studentId: studentId,
                    assignmentId: assignmentId
                }
            });

            if (alreadyAssignedAssignment) {
                return res.status(409).json({
                    error: Errors.AlreadyAssignedAssignmentToStudent,
                    data: undefined,
                    success: false,
                });
            }

            const studentAssignment = await prisma.studentAssignment.create({
                data: {
                    studentId,
                    assignmentId,
                },
            });

            res.status(201).json({
                error: undefined,
                data: parseForResponse(studentAssignment),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    }

    // POST student submitted assignment
    async submitStudentAssignment(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ["assignmentId", "studentId"])) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            const {studentId, assignmentId} = req.body;

            // check if student assignment exists
            const studentAssignment = await prisma.studentAssignment.findUnique({
                where: {
                    studentId_assignmentId: {
                        assignmentId,
                        studentId,
                    },
                },
            });

            if (!studentAssignment) {
                return res.status(404).json({
                    error: Errors.AssignmentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            // Check if assignment submission exists
            const assignmentSubmission = await prisma.assignmentSubmission.findFirst({
                where: {
                    studentAssignmentId: studentAssignment.id
                }
            });

            if (assignmentSubmission) {
                return res.status(409).json({
                    error: Errors.AssignmentAlreadySubmitted,
                    data: undefined,
                    success: false,
                });
            }

            const studentAssignmentUpdated = await prisma.assignmentSubmission.create({
                data: {
                    studentAssignmentId: studentAssignment.id
                },
            },);

            res.status(201).json({
                error: undefined,
                data: parseForResponse(studentAssignmentUpdated),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    }

    // GET assignment by id
    async getAssignmentById(req: Request, res: Response) {
        try {
            const {id} = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }
            const assignment = await prisma.assignment.findUnique({
                include: {
                    class: true,
                    studentAssignments: true,
                },
                where: {
                    id,
                },
            });

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
    }

    // POST student assignment graded
    async gradeStudentAssignment(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ["studentId", "assignmentId", "grade"])) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            const {studentId, assignmentId, grade} = req.body;

            // validate grade
            if (!["A", "A+", "B", "C", "D", "F"].includes(grade)) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                });
            }

            // check if student assignment exists
            const studentAssignment = await prisma.studentAssignment.findUnique({
                where: {
                    studentId_assignmentId: {
                        assignmentId,
                        studentId,
                    },
                },
            });

            if (!studentAssignment) {
                return res.status(404).json({
                    error: Errors.AssignmentNotFound,
                    data: undefined,
                    success: false,
                });
            }

            // Check if student assignment submitted
            const studentAssignmentSubmission = await prisma.assignmentSubmission.findFirst({
                where: {
                    studentAssignmentId: studentAssignment.id
                }
            })

            if (!studentAssignmentSubmission) {
                return res.status(400).json({
                    error: Errors.NotSubmittedError,
                    data: undefined,
                    success: false,
                });
            }

            const alreadyGradedAssignment = await prisma.gradedAssignment.findFirst({
                where: {
                    assignmentSubmission: {
                        studentAssignment: {
                            assignmentId: assignmentId
                        }
                    }
                }
            });

            if (alreadyGradedAssignment) {
                return res.status(409).json({
                    error: Errors.AlreadyGradedAssignment,
                    data: undefined,
                    success: false,
                });
            }

            const studentAssignmentGrade = await prisma.gradedAssignment.create({
                data: {
                    grade,
                    assignmentSubmissionId: studentAssignmentSubmission?.id as string
                }
            });

            res.status(201).json({
                error: undefined,
                data: parseForResponse(studentAssignmentGrade),
                success: true,
            });
        } catch (error) {
            res
                .status(500)
                .json({error: Errors.ServerError, data: undefined, success: false});
        }
    }
}