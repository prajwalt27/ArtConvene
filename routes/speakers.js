const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const speakers = await speakerService.getList();
      const artwork = await speakerService.getAllArtWork();
      return res.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async (req, res, next) => {
    try {
      const speaker = await speakerService.getSpeaker(req.params);
      const artwork = await speakerService.getAllArtWork(req.params.shortname);
      return res.render('layout', {
        pageTitle: 'Speakers',
        template: 'speaker-detail',
        speaker,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
