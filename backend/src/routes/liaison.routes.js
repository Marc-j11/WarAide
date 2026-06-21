const { Router } = require('express');
const liaisonController = require('../controllers/liaison.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const {
  createLiaisonRules,
  updateLiaisonRules,
  liaisonIdRules,
} = require('../validators/liaison.validator');

const router = Router();

router.get('/', asyncHandler(liaisonController.list));
router.get('/:id', validate(liaisonIdRules), asyncHandler(liaisonController.getById));
router.post('/', validate(createLiaisonRules), asyncHandler(liaisonController.create));
router.put('/:id', validate(updateLiaisonRules), asyncHandler(liaisonController.update));
router.delete('/:id', validate(liaisonIdRules), asyncHandler(liaisonController.remove));

module.exports = router;
