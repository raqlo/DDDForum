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

export async function CreateClassController(req, res) {
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