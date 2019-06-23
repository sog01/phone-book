const { Router } = require('express');
const router = Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/index.html'));
});

router.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/form.html'));
});

module.exports = router;