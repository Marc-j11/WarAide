const { Router } = require('express');
const itineraireController = require('../controllers/itineraire.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { itineraireRules } = require('../validators/itineraire.validator');

const router = Router();

router.post('/', validate(itineraireRules), asyncHandler(itineraireController.search));

module.exports = router;
