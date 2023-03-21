import express from 'express';
import {
    getAllImages,
    createImage,
    updateImage
} from '../controllers/ImageController';

const router = express.Router();

router.route('/').get(getAllImages).post(createImage);
router.route('/:id').patch(updateImage);

export default router;
