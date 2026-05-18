require('dotenv').config();
const app = require('./src/app');
const createDB = require('./src/db/db');
createDB();


app.listen(3000, async () => {
    console.log('Server is running on port 3000');
});

