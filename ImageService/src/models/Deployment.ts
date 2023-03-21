import mongoose from 'mongoose';
import Image from './Image';
import validateChildIdExists from '../middlewares/schema/ValdateId';

const deploymentSchema = new mongoose.Schema(
    {
        imageId: {
            type: mongoose.Types.ObjectId,
            ref: 'Image'
        }
    },
    {
        timestamps: { updatedAt: true, createdAt: false },
        versionKey: false
    }
);

deploymentSchema
    .path('imageId')
    .validate(
        validateChildIdExists(Image),
        'Image ID does not exist. Please choose an existing image ID.'
    );

const Deployment = mongoose.model('Deployment', deploymentSchema);

export default Deployment;
