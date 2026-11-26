require('dotenv').config();
const { initDb } = require('../src/db');
initDb().then(()=>{console.log('LearnX MySQL schema is ready.');process.exit(0);}).catch(e=>{console.error(e);process.exit(1);});
