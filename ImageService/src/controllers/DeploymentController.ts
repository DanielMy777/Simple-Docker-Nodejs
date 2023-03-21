import { Request, Response, NextFunction } from 'express';

import Deployment from '../models/Deployment';
import QueryFeatures from '../utils/QueryFeatures';
import { filterByDeploymentFields } from './utils/DeploymentControllerUtils';
import catchAsync from '../utils/CatchAsync';

const getAllDeployments = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const features = new QueryFeatures(Deployment.find(), req.query)
            .filter()
            .sort()
            .page();
        const deployments = await features.query;

        res.status(200).json({
            status: 'success',
            results: deployments.length,
            data: { deployments }
        });
    }
);

const createDeployment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const body = filterByDeploymentFields(req.body);
        const newDeployment = await Deployment.create(body);
        res.status(201).json({
            status: 'success',
            data: {
                deployment: newDeployment
            }
        });
    }
);

const getDeploymentsCount = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const count = await Deployment.countDocuments();
        res.status(200).json({
            status: 'success',
            data: {
                count: count
            }
        });
    }
);

export { getAllDeployments, createDeployment, getDeploymentsCount };
