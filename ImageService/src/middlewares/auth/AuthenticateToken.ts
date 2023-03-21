import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import ServerError from '../../utils/structures/ServerError';
import Keyable from '../../utils/structures/Keyable';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;

    const token = auth && auth.split(' ')[1];

    if (!token) {
        return next(
            new ServerError(
                401,
                `Please provide a valid token in authorization header!`
            )
        );
    }
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err: any, user: Keyable) => {
            if (err) {
                next(
                    new ServerError(
                        403,
                        `Your token is invalid! Please refresh your token!!`
                    )
                );
            } else {
                req['username'] = user.username;
                req['admin'] = user.admin;
                next();
            }
        }
    );
};

export default authenticateToken;
