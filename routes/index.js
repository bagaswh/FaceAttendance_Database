var express = require('express');
var router = express.Router();

const { poller } = require('../src/db-poller');
const { User } = require('../src/model/user');

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', {
    serverTime: new Date().toLocaleTimeString(),
    dates: await User.getDateList(),
    data: poller.__previousState || []
  });
});

router.get('/reset', async (req, res) => {
  await User.reset();
  return res.sendStatus(200);
});

router.get('/date', async (req, res, next) => {
  res.json(await User.getDateList());
});

router.get('/date/:date', async (req, res, next) => {
  const { date } = req.params;
  new Date(date);
});

router.post('/date', async (req, res, next) => {
  const { date } = req.query;
  if (date == 'today') {
    await User.createAttendanceTable(
      new Date()
        .toDateString()
        .split(' ')
        .join('_')
    );
  }

  res.sendStatus(200);
});

module.exports = router;
