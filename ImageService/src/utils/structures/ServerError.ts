class ServerError extends Error {
    statusCode: number;
    status: string;
    provisioned: boolean;

    constructor(statusCode: number, message: string) {
        super(message);
        this.provisioned = true;
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4')
            ? 'failure'
            : 'error';
    }
}

export default ServerError;
