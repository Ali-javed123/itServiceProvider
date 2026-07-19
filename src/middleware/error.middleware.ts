import type {
    ErrorRequestHandler
} from "express";

export const ErrorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {

    res.status(500).json({

        success: false,

        message:
            error instanceof Error
                ? error.message
                : "Internal Server Error",

    });

};