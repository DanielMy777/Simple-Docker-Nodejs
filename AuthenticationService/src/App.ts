import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';

import tokenRouter from './routes/TokenRouter';
import SwaggerDocument from './openAPI/swagger';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(SwaggerDocument));
app.use('/api/v1/token', tokenRouter);

app.use('*', (req, res, next) => {
    res.status(404).json({
        status: 'failure',
        message: 'Resource not found'
    });
});

export default app;
