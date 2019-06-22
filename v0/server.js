const express = require('express');
const app = express();
const api = require('./api');
const routers = require('./routes');
const port = 3000;

app.use('/static', express.static('public'));
app.use('/api', api);
app.use('/', routers)

app.listen(port, () => console.log(`Backend app listening on port ${port}!`));

