import mongoose from 'mongoose';
import dotenv from 'dotenv';
import activateErrorHandler from './utils/ProcessUtils';

// Importing environmental variables
dotenv.config({ path: './config.env' });
// Assigning listeners to catch unhandled exceptions (Good practice, should not happen in runtime)
activateErrorHandler();

import { getDBConnectionString, getServerPort } from './utils/EnvUtils';
import app from './App';

// Connect to the DB and run the server
getDBConnectionString
    .then((connectionString) => {
        mongoose.set('strictQuery', true);
        return mongoose.connect(connectionString);
    })
    .then((con) => {
        console.log('DB Connection Success!');
        const port = getServerPort();
        app.listen(port, () => {
            console.log(`Image service running on port ${port}...`);
        });
    })
    .catch((err) => {
        console.log('Error connecting to DB: ' + err);
    });
