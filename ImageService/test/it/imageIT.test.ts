import mongoose from 'mongoose';
import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import app from '../../src/App';
import Image from '../../src/models/Image';
import { BASE_PATH, getDBUri, getToken, hardCopy } from '../utils/TestUtils';
import { image1, image2, image3 } from '../utils/TestUtils';

const DBUri = getDBUri();
if (!DBUri) {
    console.log('Configurations invalid. Exiting...');
    process.exit(1);
}

mongoose.set('strictQuery', true);
let token = '';

beforeAll(async () => {
    const rawToken = await getToken();
    token = 'Bearer ' + rawToken;
});

beforeEach(async () => {
    await mongoose.connect(DBUri);
    await Image.deleteMany({});
    await Image.create(image1);
    await Image.create(image2);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('Authorization for /api/v1/images', () => {
    it('Should fail with 403 on invalid token', async () => {
        const res = await request(app)
            .get(BASE_PATH + '/images')
            .set('Authorization', token + 'a');
        expect(res.statusCode).toBe(403);
        expect(res.body.status).toEqual('failure');
    });
});

describe('Authorization for /api/v1/images', () => {
    it('Should fail with 401 on missing token', async () => {
        const res = await request(app).get(BASE_PATH + '/images');
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toEqual('failure');
    });
});

describe('GET /api/v1/images', () => {
    it('Should return all images', async () => {
        const res = await request(app)
            .get(BASE_PATH + '/images')
            .set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.results).toEqual(2);
    });
});

describe('GET /api/v1/images sorting', () => {
    it('Should return all images in ascending update order', async () => {
        const res1 = await request(app)
            .get(BASE_PATH + '/images')
            .query({ sort: 'asc' })
            .set('Authorization', token);
        const res2 = await request(app)
            .get(BASE_PATH + '/images')
            .query({ sort: 'dec' })
            .set('Authorization', token);
        expect(res1.statusCode).toBe(200);
        expect(res1.body.status).toEqual('success');
        expect(res2.statusCode).toBe(200);
        expect(res2.body.status).toEqual('success');
        const dataAsc = res1.body.data.images;
        const dataDec = res2.body.data.images;
        expect(dataAsc).toEqual(dataDec.reverse());
    });
});

describe('GET /api/v1/images pagination', () => {
    it('Should return only 1 image', async () => {
        const res = await request(app)
            .get(BASE_PATH + '/images')
            .query({ page: 2, limit: 1 })
            .set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.results).toEqual(1);
    });
});

describe('POST /api/v1/images', () => {
    it('Should create new image', async () => {
        const res = await request(app)
            .post(BASE_PATH + '/images')
            .set('Authorization', token)
            .send(image3);
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toEqual('success');
        expect(await Image.countDocuments()).toEqual(3);
        const id = res.body.data?.image?._id || undefined;
        const newImage = await Image.findById(id);
        expect(newImage).not.toBe(null);
    });
});

describe('POST /api/v1/images', () => {
    it('Should fail with 409 on duplicate name', async () => {
        const badImage = hardCopy(image3);
        badImage.name = image2.name;
        const res = await request(app)
            .post(BASE_PATH + '/images')
            .set('Authorization', token)
            .send(badImage);
        expect(res.statusCode).toBe(409);
        expect(res.body.status).toEqual('failure');
        expect(await Image.countDocuments()).toEqual(2);
    });
});

describe('POST /api/v1/images', () => {
    it('Should fail with 400 on missing name', async () => {
        const badImage = hardCopy(image3);
        badImage.name = '';
        const res = await request(app)
            .post(BASE_PATH + '/images')
            .set('Authorization', token)
            .send(badImage);
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        expect(await Image.countDocuments()).toEqual(2);
    });
});

describe('POST /api/v1/images', () => {
    it('Should fail with 400 on missing version', async () => {
        const badImage = hardCopy(image3);
        badImage.version = '';
        const res = await request(app)
            .post(BASE_PATH + '/images')
            .set('Authorization', token)
            .send(badImage);
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        expect(await Image.countDocuments()).toEqual(2);
    });
});

describe('POST /api/v1/images', () => {
    it('Should fail with 400 on missing repo', async () => {
        const badImage = hardCopy(image3);
        badImage.repository = '';
        const res = await request(app)
            .post(BASE_PATH + '/images')
            .set('Authorization', token)
            .send(badImage);
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        expect(await Image.countDocuments()).toEqual(2);
    });
});

describe('POST /api/v1/images', () => {
    it('Should fail with 400 on invalid version', async () => {
        const badImage = hardCopy(image3);
        badImage.version = '1.a.3';
        const res = await request(app)
            .post(BASE_PATH + '/images')
            .set('Authorization', token)
            .send(badImage);
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        expect(await Image.countDocuments()).toEqual(2);
    });
});

describe('PATCH /api/v1/images', () => {
    it('Should update image successfully', async () => {
        const newName = 'newname';
        const srcImage = await Image.findOne({});
        const id = srcImage._id;
        const res = await request(app)
            .patch(BASE_PATH + '/images/' + id)
            .set('Authorization', token)
            .send({ name: newName });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        const updatedImage = await Image.findById(id);
        expect(updatedImage.name).toEqual(newName);
    });
});

describe('PATCH /api/v1/images', () => {
    it('Should deep merge metadata successfully', async () => {
        const srcImage = await Image.findOne({ name: 'image2' });
        const id = srcImage._id;
        const res = await request(app)
            .patch(BASE_PATH + '/images/' + id)
            .set('Authorization', token)
            .send({ metadata: { f1: { ghi: 'ghi' } } });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        const updatedImage = await Image.findById(id);
        expect(updatedImage.metadata).toEqual({
            f1: {
                abc: 'abc',
                def: 'def',
                ghi: 'ghi'
            }
        });
    });
});

describe('PATCH /api/v1/images', () => {
    it('Should fail with 409 on deplicate name', async () => {
        const srcImage = await Image.findOne({ name: 'image1' });
        const id = srcImage._id;
        const res = await request(app)
            .patch(BASE_PATH + '/images/' + id)
            .set('Authorization', token)
            .send({ name: 'image2' });
        expect(res.statusCode).toBe(409);
        expect(res.body.status).toEqual('failure');
        const image = await Image.findById(id);
        expect(image.name).toEqual('image1');
    });
});

describe('PATCH /api/v1/images', () => {
    it('Should fail with 400 on missing name', async () => {
        const srcImage = await Image.findOne({ name: 'image1' });
        const id = srcImage._id;
        const res = await request(app)
            .patch(BASE_PATH + '/images/' + id)
            .set('Authorization', token)
            .send({ name: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        const image = await Image.findById(id);
        expect(image.name).toEqual('image1');
    });
});

describe('PATCH /api/v1/images', () => {
    it('Should fail with 400 on missing version', async () => {
        const srcImage = await Image.findOne({ name: 'image1' });
        const id = srcImage._id;
        const res = await request(app)
            .patch(BASE_PATH + '/images/' + id)
            .set('Authorization', token)
            .send({ version: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        const image = await Image.findById(id);
        expect(image.version).toEqual('1.0.0');
    });
});

describe('PATCH /api/v1/images', () => {
    it('Should fail with 400 on missing repo', async () => {
        const srcImage = await Image.findOne({ name: 'image1' });
        const id = srcImage._id;
        const res = await request(app)
            .patch(BASE_PATH + '/images/' + id)
            .set('Authorization', token)
            .send({ repository: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        const image = await Image.findById(id);
        expect(image.repository).toEqual('repo1');
    });
});

describe('PATCH /api/v1/images', () => {
    it('Should fail with 400 on invalid version', async () => {
        const srcImage = await Image.findOne({ name: 'image1' });
        const id = srcImage._id;
        const res = await request(app)
            .patch(BASE_PATH + '/images/' + id)
            .set('Authorization', token)
            .send({ version: '2.a.4' });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        const image = await Image.findById(id);
        expect(image.version).toEqual('1.0.0');
    });
});
