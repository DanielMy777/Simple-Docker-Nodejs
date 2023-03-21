import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';

import ImageRouter from './routes/ImageRouter';
import DeploymentRouter from './routes/DeploymentRouter';
import handleRuntimeError from './middlewares/errors/CaughtRuntimeErrorMid';
import handleResourceNotFound from './middlewares/errors/ResourceNotFoundMid';
import authenticateToken from './middlewares/auth/AuthenticateToken';
import SwaggerDocument from './OpenAPI/swagger';

const app = express();

// Add additional logs
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware to handle routing
app.use(express.json());
app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(SwaggerDocument));

app.use('/api/v1/images', authenticateToken, ImageRouter);
app.use('/api/v1/deployments', authenticateToken, DeploymentRouter);

app.all('*', handleResourceNotFound);

app.use(handleRuntimeError);

export default app;
