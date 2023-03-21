import mongoose from 'mongoose';
import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import app from '../../src/App';
import Image from '../../src/models/Image';
import { BASE_PATH, getDBUri, getToken } from '../utils/TestUtils';
import { image1, image2, image3 } from '../utils/TestUtils';
import Deployment from '../../src/models/Deployment';

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
    await Deployment.deleteMany({});
    const sampleImage1 = await Image.create(image1);
    const sampleImage2 = await Image.create(image2);
    await Deployment.create({ imageId: sampleImage1._id });
    await Deployment.create({ imageId: sampleImage2._id });
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('Authorization for /api/v1/deployments', () => {
    it('Should fail with 403 on invalid token', async () => {
        const res = await request(app)
            .get(BASE_PATH + '/deployments')
            .set('Authorization', token + 'a');
        expect(res.statusCode).toBe(403);
        expect(res.body.status).toEqual('failure');
    });
});

describe('Authorization for /api/v1/deployments', () => {
    it('Should fail with 401 on missing token', async () => {
        const res = await request(app).get(BASE_PATH + '/deployments');
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toEqual('failure');
    });
});

describe('GET /api/v1/deployments', () => {
    it('Should return all deployments', async () => {
        const res = await request(app)
            .get(BASE_PATH + '/deployments')
            .set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.results).toEqual(2);
    });
});

describe('GET /api/v1/deployments sorting', () => {
    it('Should return all deployments in ascending update order', async () => {
        const res1 = await request(app)
            .get(BASE_PATH + '/deployments')
            .query({ sort: 'asc' })
            .set('Authorization', token);
        const res2 = await request(app)
            .get(BASE_PATH + '/deployments')
            .query({ sort: 'dec' })
            .set('Authorization', token);
        expect(res1.statusCode).toBe(200);
        expect(res1.body.status).toEqual('success');
        expect(res2.statusCode).toBe(200);
        expect(res2.body.status).toEqual('success');
        const dataAsc = res1.body.data.deployments;
        const dataDec = res2.body.data.deployments;
        expect(dataAsc).toEqual(dataDec.reverse());
    });
});

describe('GET /api/v1/deployments pagination', () => {
    it('Should return only 1 deployment', async () => {
        const res = await request(app)
            .get(BASE_PATH + '/deployments')
            .query({ page: 2, limit: 1 })
            .set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.results).toEqual(1);
    });
});

describe('POST /api/v1/deployments', () => {
    it('Should create new deployment', async () => {
        const sampleImage3 = await Image.create(image3);
        const res = await request(app)
            .post(BASE_PATH + '/deployments')
            .set('Authorization', token)
            .send({ imageId: sampleImage3._id });
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toEqual('success');
        expect(await Deployment.countDocuments()).toEqual(3);
        const id = res.body.data?.deployment?._id || undefined;
        const newDeployment = await Deployment.findById(id);
        expect(newDeployment).not.toBe(null);
    });
});

describe('POST /api/v1/deployments', () => {
    it('Should fail with 400 on non existing image ID', async () => {
        const fakeId = '63f112cc9b78139e99a3c379';
        const res = await request(app)
            .post(BASE_PATH + '/deployments')
            .set('Authorization', token)
            .send({ imageId: fakeId });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        expect(res.body.message).toContain('not exist');
        expect(await Deployment.countDocuments()).toEqual(2);
    });
});

describe('POST /api/v1/deployments', () => {
    it('Should fail with 400 on invalid image ID', async () => {
        const invalidId = '123';
        const res = await request(app)
            .post(BASE_PATH + '/deployments')
            .set('Authorization', token)
            .send({ imageId: invalidId });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toEqual('failure');
        expect(res.body.message).toContain(`Invalid 'imageId'`);
        expect(await Deployment.countDocuments()).toEqual(2);
    });
});

describe('GET /api/v1/deployments/count', () => {
    it('Should get deployment count', async () => {
        const realCount = await Deployment.countDocuments();
        const res = await request(app)
            .get(BASE_PATH + '/deployments/count')
            .set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data.count).toEqual(realCount);
    });
});
