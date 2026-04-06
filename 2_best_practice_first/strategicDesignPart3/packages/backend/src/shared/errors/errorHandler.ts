import {Errors} from "./constants";
import {NextFunction, Response, Request} from "express";
import {
    ClientError,
    EmailAlreadyInUse,
    InvalidRequestBodyException, UsernameAlreadyTaken,
    UserNotFoundException,
    ValidationError
} from "./exceptions";

export class ErrorExceptionHandler {
    public handle = (
        error: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ): Response => {
        if (error instanceof InvalidRequestBodyException) {
            return res.status(400).json({
                error: Errors.ValidationError,
                data: undefined,
                success: false,
                message: error.message,
            });
        }
        if (error instanceof UserNotFoundException) {
            return res.status(404).json({
                error: Errors.UserNotFound,
                data: undefined,
                success: false,
                message: error.message,
            })
        }
        if (error instanceof ClientError) {
            return res.status(400).json({
                error: Errors.ClientError,
                data: undefined,
                success: false,
                message: error.message,
            });
        }

        if (error instanceof ValidationError) {
            return res.status(400).json({
                error: Errors.ValidationError,
                data: undefined,
                success: false,
                message: error.message,
            })
        }

        if (error instanceof EmailAlreadyInUse) {
            return res.status(409).json({
                error: Errors.EmailAlreadyInUse,
                data: undefined,
                success: false,
                message: error.message,
            })
        }

        if (error instanceof UsernameAlreadyTaken) {
            return res.status(409).json({
                error: Errors.UsernameAlreadyTaken,
                data: undefined,
                success: false,
                message: error.message,
            })
        }

        return res.status(500).json({
            error: Errors.ServerError,
            data: undefined,
            success: false,
            message: error.message,
        });
    };
}
