const { Router } = require('express');
const storyController = require('../controllers/storyController');

const router = Router();

router.post('/story', storyController.createStory);
router.get('/sessions', storyController.listSessions);
router.get('/sessions/:id', storyController.getSession);

module.exports = router;