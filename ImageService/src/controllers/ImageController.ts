import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import Image from '../models/Image';
import QueryFeatures from '../utils/QueryFeatures';
import {
    filterByImageFields,
    replaceByFuncAggregationPipeline,
    validateImageFields
} from './utils/ImageControllerUtils';
import catchAsync from '../utils/CatchAsync';
import ServerError from '../utils/structures/ServerError';
import deepMerge from '../utils/DeepMerge';
import validateVersion from '../middlewares/schema/ValidateVersion';
import Keyable from '../utils/structures/Keyable';

const getAllImages = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const features = new QueryFeatures(Image.find(), req.query)
            .filter()
            .sort()
            .page();
        const images = await features.query;

        res.status(200).json({
            status: 'success',
            results: images.length,
            data: { images }
        });
    }
);

const createImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const body = filterByImageFields(req.body);
        const newImage = await Image.create(body);
        res.status(201).json({
            status: 'success',
            data: {
                image: newImage
            }
        });
    }
);

const updateImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const reqBody = filterByImageFields(req.body);
        validateImageFields(reqBody);

        const image = await Image.findByIdAndUpdate(
            req.params.id,
            replaceByFuncAggregationPipeline(deepMerge, ['$$CURRENT', reqBody]),
            { new: true, runValidators: true }
        );
        if (!image) {
            return next(
                new ServerError(404, `No image found for ID ${req.params.id}`)
            );
        }

        res.status(200).json({
            status: 'success',
            data: {
                image: image
            }
        });
    }
);

export { getAllImages, createImage, updateImage };
