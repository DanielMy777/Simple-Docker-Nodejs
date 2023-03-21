import mongoose from 'mongoose';
import validateVersion from '../middlewares/schema/ValidateVersion';

const imageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'An image must have a name'],
            unique: true,
            trim: true
        },
        repository: {
            type: String,
            required: [true, 'An image must have a repository'],
            trim: true
        },
        version: {
            type: String,
            required: [true, 'An image must have a version'],
            validate: {
                validator: validateVersion,
                message: (version: string) =>
                    `Version must be composed of 3 numbers seperated by '.'!`
            }
        },
        metadata: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: { updatedAt: true, createdAt: false },
        versionKey: false
    }
);

const Image = mongoose.model('Image', imageSchema);

Image.schema.path('version').validate(validateVersion, 'Invalid color');

export default Image;
