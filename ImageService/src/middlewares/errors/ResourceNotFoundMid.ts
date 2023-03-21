import { Request, Response, NextFunction } from 'express';
import ServerError from '../../utils/structures/ServerError';

const handleResourceNotFound = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    next(
        new ServerError(
            404,
            `Can't find ${req.method} ${req.originalUrl} on the server!`
        )
    );
};

export default handleResourceNotFound;
