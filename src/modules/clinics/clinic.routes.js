const router = require('express').Router();
const clinicController = require('./clinic.controller');

router.post('/', clinicController.createClinic);
router.get('/', clinicController.getAllClinics);
router.get('/nearby', clinicController.getNearbyClinics);
router.get('/:id', clinicController.getClinicById);

module.exports = router;