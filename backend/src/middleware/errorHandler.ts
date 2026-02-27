import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error occurred:", err);

    const status = err.status || 500;

    let code = "INTERNAL_SERVER_ERROR";
    let message = "An unexpected error occurred.";

    if (err.code) {
        code = err.code;
        message = err.message;
    } else if (err.message && err.message.includes('Groq API Error')) {
        code = "GROQ_API_ERROR";
        message = "Failed to communicate with Groq API.";
        // Map Groq errors to 502 Bad Gateway if they are 500s from Groq, or 503
        res.status(502);
    } else if (err.message && err.message.includes('Invalid format')) {
        code = "INVALID_RESPONSE_FORMAT";
        message = "Groq returned an invalid format.";
        res.status(502);
    }

    const errorResponse: ApiError = {
        error: {
            code,
            message
        }
    };

    res.status(status === 500 && res.statusCode === 502 ? 502 : status).json(errorResponse);
};
