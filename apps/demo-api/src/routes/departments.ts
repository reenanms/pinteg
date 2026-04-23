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
 * /api/departments:
 *   get:
 *     summary: Retrieve all departments
 *     responses:
 *       200:
 *         description: A list of departments
 */
router.get('/', (req: Request, res: Response) => {
    const listReq = parseListRequest(req);
    const response = applyListRequest(store.departments, listReq);
    res.json(response);
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
router.get('/:id', (req: Request, res: Response) => {
    const getReq: GetRequest = { key: req.params.id };
    const id = parseInt(String(getReq.key), 10);
    const dept = store.departments.find(d => d.id === id);
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    
    const response: GetResponse<any> = dept;
    res.json(response);
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
router.post('/', (req: Request, res: Response) => {
    const createReq: CreateRequest<any> = { data: req.body };
    const newDept = { id: store.nextDeptId++, ...createReq.data };
    store.departments.push(newDept);
    
    const response: CreateResponse<any> = newDept;
    res.status(201).json(response);
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
router.put('/:id', (req: Request, res: Response) => {
    const updateReq: UpdateRequest<any> = { key: req.params.id, data: req.body };
    const id = parseInt(String(updateReq.key), 10);
    const index = store.departments.findIndex(d => d.id === id);
    if (index === -1) return res.status(404).json({ error: 'Department not found' });
    
    store.departments[index] = { ...store.departments[index], ...updateReq.data, id };
    
    const response: UpdateResponse<any> = store.departments[index];
    res.json(response);
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
 *       200:
 *         description: Successfully deleted
 *       400:
 *         description: Cannot delete department with assigned users  
 *       404:
 *         description: Department not found
 */
router.delete('/:id', (req: Request, res: Response) => {
    const delReq: DeleteRequest = { key: req.params.id };
    const id = parseInt(String(delReq.key), 10);
    const index = store.departments.findIndex(d => d.id === id);
    if (index === -1) return res.status(404).json({ error: 'Department not found' });

    // Cascading delete constraint simulation
    if (store.users.some(u => u.departmentId === id)) {
        return res.status(400).json({ error: 'Cannot delete department with assigned users' });
    }

    store.departments.splice(index, 1);
    
    const response: DeleteResponse = { success: true };
    res.status(200).json(response);
});

export default router;
