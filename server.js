const express = require('express');

const app = express();
const path = require('path');

const createError = require('http-errors');

const cookieSession = require('cookie-session');

const bodyParser = require('body-parser');
const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

const port = 3000;
const routes = require('./routes');

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['fsjdfal', 'djadhfljka'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './provided/views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakerService,
  })
);

app.use((req, res, next) => next(createError(404, 'File not found')));

app.use((err, req, res) => {
  res.locals.message = res.message;
  console.log(err);
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Express server listening on port: ${port}`);
});
