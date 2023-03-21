const BASE_PATH = '/api/v1';

const getToken = async () => {
    const authAddress = process.env.AUTH_ADDR || 'localhost:3001';
    if (!authAddress) {
        console.log(
            'Please provide a valid auth service address in AUTH_ADDR variable'
        );
        process.exit(1);
    }

    const res = await fetch('http://' + authAddress + '/api/v1/token', {
        method: 'POST',
        body: JSON.stringify({
            username: 'TestUser',
            password: 'test'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const resJson = await res.json();

    return resJson['token'];
};

const hardCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const getDBUri = () => {
    const DBType = process.env.DATABASE_TYPE || 'local';
    const uriVariable = ['DATABASE_CON_', DBType.toUpperCase(), '_TEST'].join(
        ''
    );
    return process.env[uriVariable];
};

const image1 = {
    name: 'image1',
    repository: 'repo1',
    version: '1.0.0'
};
const image2 = {
    name: 'image2',
    repository: 'repo2',
    version: '1.0.0',
    metadata: { f1: { abc: 'abc', def: 'def' } }
};
const image3 = {
    name: 'image3',
    repository: 'repo3',
    version: '1.0.0',
    metadata: { f1: { ghi: 'ghi' } }
};

export { image1, image2, image3 };
export { BASE_PATH, getToken, hardCopy, getDBUri };
