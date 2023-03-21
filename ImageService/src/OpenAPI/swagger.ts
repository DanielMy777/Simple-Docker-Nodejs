import {
    getAllImagesDocument,
    createImageDocument,
    updateImageDocument
} from './image.swagger';

import {
    getAllDeploymentsDocument,
    createDeploymentDocument,
    getCountOfDeploymentsDocument
} from './deployment.swagger';

const SwaggerDocument = {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'Image service',
        description:
            'This service is used to obtain and update information about images & deployments in the application.',
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
            url: 'http://localhost:3000/api/v1',
            description: 'Default local server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header',
                name: 'Authorization'
            }
        }
    },
    security: [{ bearerAuth: [] }],
    tags: [
        {
            name: 'Image'
        },
        {
            name: 'Deployment'
        }
    ],
    paths: {
        '/images': {
            get: getAllImagesDocument,
            post: createImageDocument
        },
        '/images/{id}': {
            patch: updateImageDocument
        },
        '/deployments': {
            get: getAllDeploymentsDocument,
            post: createDeploymentDocument
        },
        '/deployments/count': {
            get: getCountOfDeploymentsDocument
        }
    }
};

export default SwaggerDocument;
