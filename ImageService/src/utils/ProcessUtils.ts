import Keyable from './structures/Keyable';

// Assign listeners to process - catching unhandled exceptions (For good practice, should not happen at runtime)
export default function () {
    process.on('unhandledRejection', (err: Keyable) => {
        console.log('ERROR! ', err.name, err.message);
        console.log(
            'OOPS!!! Unhandled rejection. Please restart the application if needed'
        );
    });

    process.on('uncaughtException', (err: Keyable) => {
        console.log('ERROR! ', err.name, err.message);
        console.log('OOPS!!! Uncaught Exception. Shutting down...');
        process.exit(1);
    });
}
