import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import departmentsRouter from './routes/departments';
import usersRouter from './routes/users';

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PInteg Demo API',
            version: '1.0.0',
            description: 'Mock API demonstrating relational entity retrieval and management.',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local server'
            },
        ],
    },
    apis: ['src/routes/*.ts', './src/routes/*.ts']
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/departments', departmentsRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => {
    console.log(`Demo API is running at http://localhost:${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});
