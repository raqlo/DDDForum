import {prisma} from "./database";
import express, { Request, Response } from 'express';

const Errors = {
    ValidationError: 'ValidationError',
    StudentNotFound: 'StudentNotFound',
    ClassNotFound: 'ClassNotFound',
    AssignmentNotFound: 'AssignmentNotFound',
    ServerError: 'ServerError',
    ClientError: 'ClientError',
    StudentAlreadyEnrolled: 'StudentAlreadyEnrolled'
}


function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
        if (data[key] === undefined) return true;
    }
    return false;
}

function parseForResponse(data: unknown) {
    return JSON.parse(JSON.stringify(data));
}

function isUUID (id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

// API Endpoints

export async function CreateStudentController(req: Request, res: Response) {
    try {
        if (isMissingKeys(req.body, ['name'])) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        const {name} = req.body;

        const student = await prisma.student.create({
            data: {
                name
            }
        });

        res.status(201).json({error: undefined, data: parseForResponse(student), success: true});
    } catch (error) {
        res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
    }
}

export async function CreateClassController(req: Request, res: Response) {
    try {
        if (isMissingKeys(req.body, ['name'])) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        const {name} = req.body;

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
        if (isMissingKeys(req.body, ['studentId', 'classId'])) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        const {studentId, classId} = req.body;

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

export async function CreateAssignmentController(req: Request, res: Response) {
    try {
        if (isMissingKeys(req.body, ['classId', 'title'])) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        const {classId, title} = req.body;

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
        if (isMissingKeys(req.body, ['studentId', 'assignmentId'])) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        const {studentId, assignmentId, grade} = req.body;

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
        if (isMissingKeys(req.body, ['id'])) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        const {id} = req.body;

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

        if (isMissingKeys(req.body, ['id', 'grade'])) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false});
        }

        const {id, grade} = req.body;

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
