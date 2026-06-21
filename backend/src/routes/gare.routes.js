const { Router } = require('express');
const gareController = require('../controllers/gare.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const {
  createGareRules,
  updateGareRules,
  gareIdRules,
  listGareRules,
  nearbyGareRules,
} = require('../validators/gare.validator');

const router = Router();

router.get('/proches', validate(nearbyGareRules), asyncHandler(gareController.findNearby));
router.get('/', validate(listGareRules), asyncHandler(gareController.list));
router.get('/:id', validate(gareIdRules), asyncHandler(gareController.getById));
router.post('/', validate(createGareRules), asyncHandler(gareController.create));
router.put('/:id', validate(updateGareRules), asyncHandler(gareController.update));
router.delete('/:id', validate(gareIdRules), asyncHandler(gareController.remove));

module.exports = router;
