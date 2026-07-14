const router = require('express').Router();
const doctorController = require('./doctor.controller');

router.post('/', doctorController.createDoctor);
router.get('/', doctorController.getAllDoctors);
router.get('/nearby', doctorController.getNearbyDoctors);
router.get('/:id', doctorController.getDoctorById);

module.exports = router;