const express = require('express');
const router = express.Router();

/* GET users listing. */
router.post('/image', (req, res, next) => {
  const { data } = req.body;
  res.send('respond with a resource');
});

module.exports = router;
