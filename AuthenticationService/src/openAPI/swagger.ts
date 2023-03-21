const SwaggerDocument = {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'Authentication Service',
        description:
            'This service is used to generate JSON Web Tokens in order to communicate with other services of the application.',
        termsOfService: 'Be cool :)',
        contact: {
            name: 'Daniel Malky',
            email: 'DanielMy@mta.ac.il'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    servers: [
        {
            url: 'http://localhost:3001/api/v1',
            description: 'Default local server'
        }
    ],
    tags: [
        {
            name: 'Token'
        }
    ],
    paths: {
        '/token': {
            post: {
                tags: ['Token'],
                summary: 'Generates a token according to user credentials',
                operationId: 'getToken',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: {
                                        type: 'string',
                                        example: 'daniel'
                                    },
                                    password: {
                                        type: 'string',
                                        example: 'lovesdragonballz!'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Generated token',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            example: 'success',
                                            description: 'Success indicator'
                                        },
                                        token: {
                                            type: 'string',
                                            example:
                                                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                            description: 'The generated token'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '403': {
                        description: 'Bad credentials',
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
                                            example: 'Username or password incorrect!!',
                                            description:
                                                'Error message about bad credentials'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Server error',
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
                                                'Secret is missing from config.env!!',
                                            description:
                                                'Error message about missing environmental variables'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export default SwaggerDocument;
