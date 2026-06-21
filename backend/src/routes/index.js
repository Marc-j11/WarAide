const { Router } = require('express');
const gareRoutes = require('./gare.routes');
const liaisonRoutes = require('./liaison.routes');
const itineraireRoutes = require('./itineraire.routes');
const authRoutes = require('./auth.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/gares', gareRoutes);
router.use('/liaisons', liaisonRoutes);
router.use('/itineraire', itineraireRoutes);

module.exports = router;
