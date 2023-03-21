import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';

import User from '../models/User';

const users: Array<User> = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/users.json`, 'utf8')
);

const sendError = (res: Response, code: number, message: string) => {
    res.status(code).json({
        status: 'failure',
        message: message
    });
};

const validateUser = (username: string, password: string) => {
    return users.find(
        (user: User | undefined) =>
            user.username.toLowerCase() === username.toLowerCase() &&
            user.password === password
    );
};

const validateDataForToken = (req: Request, res: Response) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const body = req.body;

    if (!secret) {
        return {
            code: 500,
            message: 'Secret is missing from config.env!!',
            valid: false
        };
    }
    const user: User = validateUser(body.username, body.password);
    if (!user) {
        return {
            code: 403,
            message: 'Username or password incorrect!!',
            valid: false
        };
    }

    return { user, secret, valid: true };
};

const getToken = async (req: Request, res: Response, next: NextFunction) => {
    const { user, secret, code, message, valid } = validateDataForToken(req, res);
    if (valid) {
        const token = jwt.sign({ username: user.username, admin: user.admin }, secret, {
            expiresIn: '30m'
        });

        res.status(201).json({ status: 'success', token: token });
    } else {
        sendError(res, code, message);
    }
};

export { getToken };
