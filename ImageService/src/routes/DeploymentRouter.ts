import express from 'express';
import {
    getAllDeployments,
    createDeployment,
    getDeploymentsCount
} from '../controllers/DeploymentController';

const router = express.Router();

router.route('/').get(getAllDeployments).post(createDeployment);
router.route('/count').get(getDeploymentsCount);

export default router;
