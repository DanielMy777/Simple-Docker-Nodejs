import { Request, Response, NextFunction } from 'express';

import Deployment from '../../src/models/Deployment';
import {
    createDeployment,
    getAllDeployments,
    getDeploymentsCount
} from '../../src/controllers/DeploymentController';
import ServerError from '../../src/utils/structures/ServerError';

const goodDeployment = {
    imageId: '123ok'
};

const badDeployment = {
    imageId: '321err'
};

describe('createDeployment', () => {
    let mReq: Request;
    let mRes: Response;
    let mNext: NextFunction;

    beforeEach(() => {
        mRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        mNext = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    //======================================================================
    it('should create a deployment on valid', async () => {
        //arrange
        jest.spyOn(Deployment, 'create').mockImplementationOnce(
            (dep) => goodDeployment
        );
        mReq = { body: goodDeployment } as unknown as Request;
        //act
        await createDeployment(mReq, mRes, mNext);
        //assert
        expect(Deployment.create).toBeCalledWith(goodDeployment);
        expect(mRes.status).toBeCalledWith(201);
        expect(mRes.json).toBeCalledWith({
            status: 'success',
            data: {
                deployment: goodDeployment
            }
        });
    });
    //======================================================================

    //======================================================================
    it('should fail on error from model', async () => {
        //arrange
        jest.spyOn(Deployment, 'create').mockImplementationOnce((dep) => {
            throw new ServerError(400, 'fake message');
        });
        mReq = { body: badDeployment } as unknown as Request;
        //act
        await createDeployment(mReq, mRes, mNext);
        //assert
        expect(Deployment.create).toBeCalledWith(badDeployment);
        expect(mNext).toBeCalledWith(expect.any(Error));
    });
    //======================================================================
});

describe('getDeploymentsCount', () => {
    let mReq: Request;
    let mRes: Response;
    let mNext: NextFunction;
    const nDocs = 5;

    beforeEach(() => {
        mRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        mNext = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    //======================================================================
    it('should get the number of deployments', async () => {
        //arrange
        jest.spyOn(Deployment, 'countDocuments').mockImplementationOnce(
            () => nDocs as any
        );
        //act
        await getDeploymentsCount(mReq, mRes, mNext);
        //assert
        expect(Deployment.countDocuments).toBeCalledTimes(1);
        expect(mRes.status).toBeCalledWith(200);
        expect(mRes.json).toBeCalledWith({
            status: 'success',
            data: {
                count: nDocs
            }
        });
    });
    //======================================================================
});

describe('getAllDeployments', () => {
    let mReq: Request;
    let mRes: Response;
    let mNext: NextFunction;

    beforeEach(() => {
        mRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        mNext = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    //======================================================================
    it('should call DB and succeed', async () => {
        //arrange
        jest.spyOn(Deployment, 'find');
        //act
        await getAllDeployments(mReq, mRes, mNext);
        //assert
        expect(Deployment.find).toBeCalled();
    });
    //======================================================================
});
