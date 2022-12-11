const express = require('express');

const { check, validationResult } = require('express-validate');

const router = express.Router();

const validations = [
  check('name').trim().isLength({ min: 3 }).escap().withMessage('A name is required'),
  check('email').trim().isEmail().normalizeEmail().withMessage('A name is required'),
  check('title').trim().isLength({ min: 3 }).escap().withMessage('A title is required'),
  check('message').trim().isLength({ min: 5 }).escap().withMessage('A message is required'),
];

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();

      const errors = req.session.feedback ? req.session.feedback.errors : false;

      const succcessMessage = req.session.feedback ? req.session.feedback.message : false;

      req.session.feedback = {};

      return res.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors,
        succcessMessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post('/', validations, async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.send('Feedback form posted');
      }

      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      req.session.feedback = {
        message: 'Thank for your feedback!',
      };
      console.log(req.body);
      return res.send('Feedback form posted');
    } catch (err) {
      return next(err);
    }
  });

  router.post('/api', validations, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
      }
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      const feedback = await feedbackService.getList();
      return res.json({ feedback, succcessMessage: 'Thank you for your feedback' });
    } catch (err) {
      return next(err);
    }
  });
  return router;
};
