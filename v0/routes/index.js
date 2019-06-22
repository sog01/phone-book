const { Router } = require('express');
const router = Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/index.html'));
});

module.exports = router;