const sortParamSchema = {
    name: 'sort',
    in: 'query',
    default: 'dec',
    example: 'asc',
    required: false,
    description:
        'When set to "asc", documents will be returned in ascending order by update time, otherwise will be returned in descending order (default).',
    schema: {
        type: 'string'
    }
};

const pageParamSchema = {
    name: 'page',
    in: 'query',
    default: 1,
    example: 2,
    required: false,
    description:
        'The page you want to get the documents from. Each page consists of [limit] documents. (If invalid, will be default)',
    schema: {
        type: 'integer'
    }
};

const limitParamSchema = {
    name: 'limit',
    in: 'query',
    default: 50,
    example: 3,
    required: false,
    description:
        'The limit of documents you want to appear in each page for pagination. (If invalid, will be default)',
    schema: {
        type: 'integer'
    }
};

const tokenHeaderSchema = {
    name: 'Authorization',
    in: 'header',
    default: 'None',
    example: 'Bearer [token]',
    required: true,
    description:
        'Authentication token obtained from authentication service. (With swagger UI, do not pass a value in the box...Instead, use the green Authorize button)',
    schema: {
        type: 'string'
    }
};

const errorSchema = {
    type: 'object',
    example: '{...}',
    description:
        'The raw error object as was generated by the server. Only providable when using "development" mode!'
};

const badTokenSchema = {
    description: 'Bad Authentication',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'failure',
                        description: 'Failure indicator'
                    },
                    message: {
                        type: 'string',
                        example:
                            'Your token is invalid! Please refresh your token!!',
                        description: 'Error message about bad auth'
                    },
                    error: errorSchema
                }
            }
        }
    }
};

const noTokenSchema = {
    description: 'No Authentication',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'failure',
                        description: 'Failure indicator'
                    },
                    message: {
                        type: 'string',
                        example:
                            'Please provide a valid token in authorization header!',
                        description: 'Error message about no auth'
                    },
                    error: errorSchema
                }
            }
        }
    }
};

const duplicateSchema = {
    description: 'Duplicate of unique field',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'failure',
                        description: 'Failure indicator'
                    },
                    message: {
                        type: 'string',
                        example:
                            'Another document with field [key] as [value] already exists, Please choose a different value',
                        description: 'Error message about duplicaion'
                    },
                    error: errorSchema
                }
            }
        }
    }
};

const validationErrorSchema = {
    description: 'Validation error when updating / creating field',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'failure',
                        description: 'Failure indicator'
                    },
                    message: {
                        type: 'string',
                        example:
                            'Invalid input data: [*] [document] must have a [key]!',
                        description: 'Error message about duplicaion'
                    },
                    error: errorSchema
                }
            }
        }
    }
};

const notFoundSchema = {
    description: 'Document not found',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'failure',
                        description: 'Failure indicator'
                    },
                    message: {
                        type: 'string',
                        example: 'No document found for ID [id]',
                        description: 'Error message about miss'
                    },
                    error: errorSchema
                }
            }
        }
    }
};

export {
    sortParamSchema,
    pageParamSchema,
    limitParamSchema,
    tokenHeaderSchema,
    badTokenSchema,
    noTokenSchema,
    duplicateSchema,
    validationErrorSchema,
    notFoundSchema
};
