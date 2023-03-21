import { flterByFields } from '../../utils/FilterUtils';
import validateVersion from '../../middlewares/schema/ValidateVersion';
import Keyable from '../../utils/structures/Keyable';
import ServerError from '../../utils/structures/ServerError';

const replaceByFuncAggregationPipeline = (func: Function, args: any[]) => [
    {
        $replaceWith: {
            $function: {
                body: func.toString(),
                args: args,
                lang: 'js'
            }
        }
    }
];

const filterByImageFields = (body: object) => {
    return flterByFields(body, ['name', 'repository', 'version', 'metadata']);
};

const validateRequiredString = (str: string): boolean => {
    if (!str) return false;

    const strCpy = `${str}`;
    strCpy.trim();
    return str.length > 0;
};

const validateImageFields = (body: Keyable) => {
    const errArray = [];

    if (body.version !== undefined && !validateVersion(body.version)) {
        errArray.push(
            new ServerError(
                400,
                `Version must be composed of 3 numbers seperated by '.'!`
            )
        );
    }
    if (body.name !== undefined && !validateRequiredString(body.name)) {
        errArray.push(new ServerError(400, `An image must have a name`));
    }
    if (
        body.repository !== undefined &&
        !validateRequiredString(body.repository)
    ) {
        errArray.push(new ServerError(400, `An image must have a repository`));
    }
    if (errArray.length > 0) {
        const err = new ServerError(400, 'Validation errors have occured');
        err.name = 'ValidationError';
        err['errors'] = errArray;
        throw err;
    }
};

export {
    filterByImageFields,
    validateImageFields,
    replaceByFuncAggregationPipeline
};
