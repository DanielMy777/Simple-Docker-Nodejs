import { Request, Response, NextFunction } from 'express';

import Image from '../../src/models/Image';
import {
    createImage,
    getAllImages,
    updateImage
} from '../../src/controllers/ImageController';
import ServerError from '../../src/utils/structures/ServerError';

const image1 = {
    name: 'image1',
    repository: 'repo1',
    version: '1.0.0'
};
const image2 = {
    name: 'image2',
    repository: 'repo2',
    version: '1.0.0'
};
const badImage = {
    name: 'image3',
    repository: '',
    version: '1.a.0'
};

describe('createImage', () => {
    let mReq: Request;
    let mRes: Response;
    let mNext: NextFunction;

    beforeEach(() => {
        mRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        mNext = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    //======================================================================
    it('should create an image on valid', async () => {
        //arrange
        jest.spyOn(Image, 'create').mockImplementationOnce((image) => image1);
        mReq = { body: image1 } as unknown as Request;
        //act
        await createImage(mReq, mRes, mNext);
        //assert
        expect(Image.create).toBeCalledWith(image1);
        expect(mRes.status).toBeCalledWith(201);
        expect(mRes.json).toBeCalledWith({
            status: 'success',
            data: {
                image: image1
            }
        });
    });
    //======================================================================

    //======================================================================
    it('should fail on error from model', async () => {
        //arrange
        jest.spyOn(Image, 'create').mockImplementationOnce((badImage) => {
            throw new ServerError(400, 'fake message');
        });
        mReq = { body: badImage } as unknown as Request;
        //act
        await createImage(mReq, mRes, mNext);
        //assert
        expect(Image.create).toBeCalledWith(badImage);
        expect(mNext).toBeCalledWith(expect.any(Error));
    });
    //======================================================================
});

describe('updateImage', () => {
    let mReq: Request;
    let mRes: Response;
    let mNext: NextFunction;
    const id = '123';

    beforeEach(() => {
        mRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        mNext = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    //======================================================================
    it('should update an image on valid', async () => {
        //arrange
        jest.spyOn(Image, 'findByIdAndUpdate').mockImplementationOnce(
            (id, fltr, opts) => image2 as any
        );
        mReq = { params: { id: '123' }, body: image2 } as unknown as Request;
        //act
        await updateImage(mReq, mRes, mNext);
        //assert
        expect(Image.findByIdAndUpdate).toBeCalledWith(
            id,
            expect.any(Array),
            expect.any(Object)
        );
        expect(mRes.status).toBeCalledWith(200);
        expect(mRes.json).toBeCalledWith({
            status: 'success',
            data: {
                image: image2
            }
        });
    });
    //======================================================================

    //======================================================================
    it('should fail on error from model', async () => {
        //arrange

        jest.spyOn(Image, 'findByIdAndUpdate').mockImplementationOnce(
            (id, fltr, opts) => {
                throw new ServerError(400, 'fake message');
            }
        );
        mReq = { params: { id: '123' }, body: image1 } as unknown as Request;
        //act
        await updateImage(mReq, mRes, mNext);
        //assert
        expect(Image.findByIdAndUpdate).toBeCalledWith(
            id,
            expect.any(Array),
            expect.any(Object)
        );
        expect(mNext).toBeCalledWith(expect.any(Error));
    });
    //======================================================================

    //======================================================================
    it('should fail on id not exist from model', async () => {
        //arrange
        jest.spyOn(Image, 'findByIdAndUpdate').mockImplementationOnce(
            (id, fltr, opts) => undefined
        );
        mReq = { params: { id: '123' }, body: image1 } as unknown as Request;
        //act
        await updateImage(mReq, mRes, mNext);
        //assert
        expect(Image.findByIdAndUpdate).toBeCalledWith(
            id,
            expect.any(Array),
            expect.any(Object)
        );
        expect(mNext).toBeCalledWith(expect.any(Error));
    });
    //======================================================================

    //======================================================================
    it('should fail on validation error', async () => {
        //arrange
        jest.spyOn(Image, 'findByIdAndUpdate').mockImplementationOnce(
            (id, fltr, opts) => image1 as any
        );
        mReq = { params: { id: '123' }, body: badImage } as unknown as Request;
        //act
        await updateImage(mReq, mRes, mNext);
        //assert
        expect(Image.findByIdAndUpdate).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(expect.any(Error));
    });
    //======================================================================

    describe('getAllImages', () => {
        let mReq: Request;
        let mRes: Response;
        let mNext: NextFunction;

        beforeEach(() => {
            mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;
            mNext = jest.fn();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        //======================================================================
        it('should call DB and succeed', async () => {
            //arrange
            jest.spyOn(Image, 'find');
            //act
            getAllImages(mReq, mRes, mNext);
            //assert
            expect(Image.find).toBeCalled();
        });
        //======================================================================
    });
});
