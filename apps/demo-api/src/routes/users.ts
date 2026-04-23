import { Router, Request, Response } from 'express';
import {
    GetRequest,
    GetResponse,
    CreateRequest,
    CreateResponse,
    UpdateRequest,
    UpdateResponse,
    DeleteRequest,
    DeleteResponse
} from 'pinteg-data-source-contracts';
import { store } from '../data/store';
import { parseListRequest, applyListRequest } from '../utils/contracts';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users, including populated department data
 */
router.get('/', (req: Request, res: Response) => {
    const listReq = parseListRequest(req);
    
    // First, populate the data
    const populatedUsers = store.users.map(u => ({
        ...u,
        department: store.departments.find(d => d.id === u.departmentId) || null
    }));

    // Then apply contract filters and pagination
    const response = applyListRequest(populatedUsers, listReq);
    
    res.json(response);
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
router.get('/:id', (req: Request, res: Response) => {
    const getReq: GetRequest = { key: req.params.id };
    const id = parseInt(String(getReq.key), 10);
    const user = store.users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const populated = {
        ...user,
        department: store.departments.find(d => d.id === user.departmentId) || null
    };

    const response: GetResponse<any> = populated;
    res.json(response);
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
router.post('/', (req: Request, res: Response) => {
    const createReq: CreateRequest<any> = { data: req.body };

    // Foreign Key constraint simulation
    if (createReq.data.departmentId && !store.departments.some(d => d.id === createReq.data.departmentId)) {
        return res.status(400).json({ error: 'Invalid departmentId foreign key constraint' });
    }

    const newUser = { id: store.nextUserId++, ...createReq.data };
    store.users.push(newUser);
    
    const response: CreateResponse<any> = newUser;
    res.status(201).json(response);
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
router.put('/:id', (req: Request, res: Response) => {
    const updateReq: UpdateRequest<any> = { key: req.params.id, data: req.body };
    const id = parseInt(String(updateReq.key), 10);

    // Foreign Key constraint simulation
    if (updateReq.data.departmentId && !store.departments.some(d => d.id === updateReq.data.departmentId)) {
        return res.status(400).json({ error: 'Invalid departmentId foreign key constraint' });
    }

    const index = store.users.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    store.users[index] = { ...store.users[index], ...updateReq.data, id };
    
    const response: UpdateResponse<any> = store.users[index];
    res.json(response);
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
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', (req: Request, res: Response) => {
    const delReq: DeleteRequest = { key: req.params.id };
    const id = parseInt(String(delReq.key), 10);
    const index = store.users.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    store.users.splice(index, 1);
    
    const response: DeleteResponse = { success: true };
    res.status(200).json(response);
});

export default router;
