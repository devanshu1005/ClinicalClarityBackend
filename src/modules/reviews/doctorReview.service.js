const mongoose = require('mongoose');

const DoctorReview = require('./doctorReview.model');
const Doctor = require('../doctors/doctor.model');
const Appointment = require('../appointments/appointment.model');

const createReview = async ({
    doctorId,
    appointmentId,
    patientId,
    rating,
    review,
}) => {
    // Check appointment exists
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        throw new Error('Appointment not found');
    }

    if (!appointment.patientId) {
        throw new Error(
            'Appointment is missing patient information.'
        );
    }


    // Verify appointment belongs to logged-in user
    if (appointment.patientId.toString() !== patientId.toString()) {
        throw new Error(
            'You are not allowed to review this appointment'
        );
    }

    // Verify doctor matches
    if (appointment.doctorId.toString() !== doctorId.toString()) {
        throw new Error(
            'Doctor does not match appointment'
        );
    }

    // Appointment should be completed
    if (appointment.status !== 'COMPLETED') {
        throw new Error(
            'You can review only completed appointments'
        );
    }

    // One review per appointment
    const existingReview = await DoctorReview.findOne({
        appointmentId,
    });

    if (existingReview) {
        throw new Error(
            'Review already submitted for this appointment'
        );
    }

    // Save review
    const createdReview = await DoctorReview.create({
        doctorId,
        appointmentId,
        patientId,
        rating,
        review,
    });

    // Recalculate doctor rating
    const stats = await DoctorReview.aggregate([
        {
            $match: {
                doctorId: new mongoose.Types.ObjectId(doctorId),
            },
        },
        {
            $group: {
                _id: '$doctorId',
                averageRating: {
                    $avg: '$rating',
                },
                totalReviews: {
                    $sum: 1,
                },
            },
        },
    ]);

    const averageRating =
        stats.length > 0
            ? Number(stats[0].averageRating.toFixed(1))
            : 0;

    const totalReviews =
        stats.length > 0
            ? stats[0].totalReviews
            : 0;

    await Doctor.findByIdAndUpdate(
        doctorId,
        {
            averageRating,
            totalReviews,
        },
        {
            new: true,
        }
    );

    return createdReview;
};

const getReviewsByDoctorId = async (doctorId) => {
    return DoctorReview.find({
        doctorId,
    })
        .populate('patientId', 'email')
        .sort({
            createdAt: -1,
        });
};

module.exports = {
    createReview,
    getReviewsByDoctorId,
};