import { NextFunction, Request, Response } from 'express';

import Keyable from '../../utils/structures/Keyable';
import ServerError from '../../utils/structures/ServerError';

function handleCastError(err: Keyable) {
    const message = `Invalid '${err.path}': '${err.value}'`;
    return new ServerError(400, message);
}

function handleDuplicateFields(err: Keyable) {
    const key = Object.keys(err.keyValue)[0];
    const val = Object.values(err.keyValue)[0];
    const message = `Another document with field '${key}' as '${val}' already exists, Please choose a different value`;
    return new ServerError(409, message);
}

function handleValidationError(err: Keyable) {
    const errors = Object.values(err.errors).map((el: Keyable) =>
        el.name === 'CastError' ? handleCastError(el).message : el.message
    );
    const message = `Invalid input data: [*] ${errors.join(`. [*] `)}`;
    return new ServerError(400, message);
}

function wrapError(err: Keyable) {
    switch (err.name) {
        case 'CastError':
            return handleCastError(err);
        case 'ValidationError':
            return handleValidationError(err);
        case 'MongoServerError':
            if (err.code === 11000) {
                return handleDuplicateFields(err);
            }
        default:
            return new ServerError(
                err.statusCode,
                err.provisioned ? err.message : err.message
            );
    }
}

function handleError(
    err: Keyable,
    req: Request,
    res: Response,
    next: NextFunction
) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const newError = wrapError(err);

    let jsonResponse: Keyable = {
        status: newError.status,
        message: newError.message
    };
    if (process.env.NODE_ENV === 'development') {
        jsonResponse = { ...jsonResponse, error: err };
    }

    res.status(newError.statusCode).json({
        ...jsonResponse
    });
}

export default handleError;
