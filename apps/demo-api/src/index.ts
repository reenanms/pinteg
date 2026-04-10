import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

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
    apis: ['src/index.ts', './src/index.ts']
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// In-memory data store
let departments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Human Resources' },
    { id: 3, name: 'Marketing' }
];
let nextDeptId = 4;

let users = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'admin', departmentId: 1 },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', departmentId: 1 },
    { id: 3, name: 'Charlie Brown', email: 'charles@example.com', role: 'user', departmentId: 2 }
];
let nextUserId = 4;

// --- DEPARTMENTS ---

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Retrieve all departments
 *     responses:
 *       200:
 *         description: A list of departments
 */
app.get('/api/departments', (req: Request, res: Response) => {
    res.json(departments);
});

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Retrieve a specific department by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The department object
 *       404:
 *         description: Department not found
 */
app.get('/api/departments/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const dept = departments.find(d => d.id === id);
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    res.json(dept);
});

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a new department
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created department
 */
app.post('/api/departments', (req: Request, res: Response) => {
    const newDept = { id: nextDeptId++, ...req.body };
    departments.push(newDept);
    res.status(201).json(newDept);
});

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Update a department
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated department
 *       404:
 *         description: Department not found
 */
app.put('/api/departments/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const index = departments.findIndex(d => d.id === id);
    if (index === -1) return res.status(404).json({ error: 'Department not found' });
    departments[index] = { ...departments[index], ...req.body, id };
    res.json(departments[index]);
});

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Delete a department
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       400:
 *         description: Cannot delete department with assigned users  
 *       404:
 *         description: Department not found
 */
app.delete('/api/departments/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const index = departments.findIndex(d => d.id === id);
    if (index === -1) return res.status(404).json({ error: 'Department not found' });

    // Cascading delete constraint simulation
    if (users.some(u => u.departmentId === id)) {
        return res.status(400).json({ error: 'Cannot delete department with assigned users' });
    }

    departments.splice(index, 1);
    res.status(204).send();
});

// --- USERS ---

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of users, including populated department data
 */
app.get('/api/users', (req: Request, res: Response) => {
    let result = users;

    const departmentId = req.query.departmentId;
    if (departmentId) {
        result = users.filter(u => u.departmentId === parseInt(departmentId as string, 10));
    }

    // Join with department data to simulate a complex relational API response
    const populated = result.map(u => ({
        ...u,
        department: departments.find(d => d.id === u.departmentId) || null
    }));

    res.json(populated);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a specific user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The user object
 *       404:
 *         description: User not found
 */
app.get('/api/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const populated = {
        ...user,
        department: departments.find(d => d.id === user.departmentId) || null
    };

    res.json(populated);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               departmentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created user
 *       400:
 *         description: Invalid foreign key
 */
app.post('/api/users', (req: Request, res: Response) => {
    // Foreign Key constraint simulation
    if (req.body.departmentId && !departments.some(d => d.id === req.body.departmentId)) {
        return res.status(400).json({ error: 'Invalid departmentId foreign key constraint' });
    }

    const newUser = { id: nextUserId++, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated user
 *       400:
 *         description: Invalid foreign key
 *       404:
 *         description: User not found
 */
app.put('/api/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    // Foreign Key constraint simulation
    if (req.body.departmentId && !departments.some(d => d.id === req.body.departmentId)) {
        return res.status(400).json({ error: 'Invalid departmentId foreign key constraint' });
    }

    const index = users.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    users[index] = { ...users[index], ...req.body, id };
    res.json(users[index]);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: User not found
 */
app.delete('/api/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    users.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Demo API is running at http://localhost:${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});
