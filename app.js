const express = require('express');
const helloworld = require('./routes/helloworld');

const app = express();

app.use(express.json());

app.use('/', helloworld);

app.listen(3000, () => console.log('Server Running'));
