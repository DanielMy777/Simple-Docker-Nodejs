const createDBErrorMessage = (type: string, vars: string[]): string => {
    return `Database type ${type} detected but missing configurations - 
            Please check ${vars.join(
                ' and '
            )} in your environmental variables.`;
};

const getDBConnectionString = new Promise<string>((resolve, reject) => {
    const DBType = process.env.DATABASE_TYPE;

    switch (DBType) {
        case 'remote':
            if (!process.env.DATABASE_CON_REMOTE) {
                reject(createDBErrorMessage('remote', ['DATABASE_CON_REMOTE']));
            } else if (
                !process.env.DATABASE_USERNAME ||
                !process.env.DATABASE_PASSWORD
            ) {
                reject(
                    createDBErrorMessage('remote', [
                        'DATABASE_USERNAME',
                        'DATABASE_PASSWORD'
                    ])
                );
            } else {
                resolve(
                    process.env.DATABASE_CON_REMOTE?.replace(
                        '<password>',
                        process.env.DATABASE_PASSWORD!
                    )
                );
            }
            break;
        case 'local':
            if (!process.env.DATABASE_CON_LOCAL) {
                reject(createDBErrorMessage('local', ['DATABASE_CON_LOCAL']));
            } else {
                resolve(process.env.DATABASE_CON_LOCAL);
            }
            break;
        default:
            reject(
                'Database type not detected (local/remote). ' +
                    'Please check DATABASE_TYPE in your environmental variables.'
            );
    }
});

const getServerPort = () => {
    return process.env.PORT || 3000;
};

export { getDBConnectionString, getServerPort };
