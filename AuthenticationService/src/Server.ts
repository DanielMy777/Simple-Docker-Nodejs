import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import app from './App';

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Authentication service running on port ${port}...`);
});
