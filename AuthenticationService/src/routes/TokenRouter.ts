import express from 'express';
import { getToken } from '../controllers/TokenController';

const router = express.Router();
router.route('/').post(getToken);

export default router;
